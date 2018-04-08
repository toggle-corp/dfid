import PropTypes from 'prop-types';
import React from 'react';
import mapboxgl from 'mapbox-gl';


const propTypes = {
    className: PropTypes.string,
    geojson: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    idKey: PropTypes.string,
    labelKey: PropTypes.string,
    // eslint-disable-next-line react/no-unused-prop-types
    colorMapping: PropTypes.objectOf(PropTypes.string),
    // eslint-disable-next-line react/no-unused-prop-types
    strokeColor: PropTypes.string,

    selections: PropTypes.arrayOf(PropTypes.any),
    onClick: PropTypes.func,

    synchronizer: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};
const defaultProps = {
    className: '',
    geojson: undefined,
    idKey: '',
    labelKey: '',
    colorMapping: {
        undefined: '#088',
    },
    strokeColor: '#fff',

    selections: [],
    onClick: undefined,

    synchronizer: undefined,
};

const getInFilter = (key, values) => {
    if (values.length === 0) {
        return ['in', key, ''];
    }

    return ['in', key, ...values];
};


export default class Map extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            map: undefined,
        };
        this.layers = [];
        this.sources = [];
    }

    componentDidMount() {
        this.mounted = true;

        // Add the mapbox map
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
        const map = new mapboxgl.Map({
            center: [50, 10],
            container: this.mapElement,
            style: process.env.REACT_APP_MAPBOX_STYLE,
            zoom: 2,
        });

        map.on('load', () => {
            // Since the map is loaded asynchronously, make sure
            // we are still mounted before doing setState
            if (this.mounted) {
                this.setState({ map }, () => {
                    this.loadMapLayers(this.props);
                });
            }
        });

        setTimeout(() => {
            map.resize();
        }, 200);

        this.initializeMap(map);

        if (this.props.synchronizer) {
            this.props.synchronizer.register(this);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.geojson !== nextProps.geojson) {
            this.loadMapLayers(nextProps);
            return;
        }

        const { map } = this.state;

        if (this.props.colorMapping !== nextProps.colorMapping && map) {
            const { idKey, colorMapping } = nextProps;
            map.setPaintProperty('geojson-fill', 'fill-color', {
                property: idKey,
                type: 'categorical',
                stops: Object.entries(colorMapping),
                default: '#088',
            });
        }

        if (this.props.selections !== nextProps.selections && map) {
            const { selections, idKey } = nextProps;
            map.setFilter('geojson-selected', getInFilter(idKey, selections));
        }
    }

    componentWillUnmount() {
        this.mounted = false;

        // Remove the mapbox map
        const { map } = this.state;
        if (map) {
            this.destroyMapLayers();
            map.remove();
            this.setState({ map: undefined });
        }

        if (this.props.synchronizer) {
            this.props.synchronizer.unregister(this);
        }
    }

    getClassName() {
        const { className } = this.props;
        const classNames = [
            className,
            'map',
        ];
        return classNames.join(' ');
    }

    handleMouseOver = (id) => {
        const { map } = this.state;
        const { idKey } = this.props;
        if (!map) {
            return;
        }

        map.setFilter('geojson-hover', ['==', idKey, id]);
    }

    handleMouseOut = () => {
        const { map } = this.state;
        const { idKey } = this.props;
        if (!map) {
            return;
        }

        map.setFilter('geojson-hover', ['==', idKey, '']);
    }

    /* eslint-disable no-param-reassign */
    initializeMap = (map) => {
        const { idKey, labelKey, synchronizer } = this.props;

        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
        });

        map.on('zoom', (e) => {
            if (e.originalEvent) {
                popup.setLngLat(map.unproject([
                    e.originalEvent.offsetX,
                    e.originalEvent.offsetY - 8,
                ]));
            }
        });

        let lastFeature;
        map.on('mouseenter', 'geojson-fill', (e) => {
            const feature = e.features[0];
            popup.setHTML(feature.properties[labelKey])
                .addTo(map);

            if (synchronizer) {
                lastFeature = feature;
                synchronizer.onMouseOver(this, feature.properties[idKey]);
            }
        });

        map.on('mousemove', 'geojson-fill', (e) => {
            const feature = e.features[0];
            map.setFilter('geojson-hover', ['==', idKey, feature.properties[idKey]]);
            map.getCanvas().style.cursor = 'pointer';

            popup.setLngLat(map.unproject([
                e.point.x,
                e.point.y - 8,
            ])).setHTML(feature.properties[labelKey]);

            if (synchronizer && lastFeature !== feature) {
                synchronizer.onMouseOut(this, lastFeature.properties[idKey]);
                lastFeature = feature;
                synchronizer.onMouseOver(this, feature.properties[idKey]);
            }
        });

        map.on('mouseleave', 'geojson-fill', () => {
            map.setFilter('geojson-hover', ['==', idKey, '']);
            map.getCanvas().style.cursor = '';

            popup.remove();

            if (synchronizer && lastFeature) {
                synchronizer.onMouseOut(this, lastFeature.properties[idKey]);
            }
        });

        map.on('click', 'geojson-fill', (e) => {
            if (this.props.onClick) {
                const feature = e.features[0];
                this.props.onClick(feature.properties[idKey]);
            }
        });
    }
    /* eslint-enable no-param-reassign */

    destroyMapLayers() {
        const { map } = this.state;
        this.layers.forEach(layer => map.removeLayer(layer));
        this.sources.forEach(source => map.removeSource(source));
        this.layers = [];
        this.sources = [];
    }

    loadMapLayers(props) {
        const { map } = this.state;
        const { geojson, idKey, colorMapping, selections, strokeColor, synchronizer } = props;

        if (!map || !geojson) {
            return;
        }

        if (synchronizer) {
            synchronizer.removeAllElements(this);
            geojson.features.forEach((f) => {
                synchronizer.addElement(this, f.properties[idKey], f.properties);
            });
        }

        map.fitBounds(
            [[
                80.06014251708984,
                26.347515106201286,
            ], [
                88.20392608642595,
                30.447021484375057,
            ]],
            { padding: 48 },
        );

        if (this.sources.length > 0 || this.layers.length > 0) {
            this.destroyMapLayers();
        }

        const basePaint = {
            'fill-color': {
                property: idKey,
                type: 'categorical',
                stops: Object.entries(colorMapping),
                default: '#088',
            },
            'fill-opacity': 0.8,
        };

        map.addSource('geojson', {
            type: 'geojson',
            data: geojson,
        });
        this.sources.push('geojson');

        map.addLayer({
            id: 'geojson-fill',
            type: 'fill',
            source: 'geojson',
            paint: basePaint,
        });
        map.addLayer({
            id: 'geojson-stroke',
            type: 'line',
            source: 'geojson',
            paint: {
                'line-color': strokeColor,
                'line-width': 1,
            },
        });
        map.addLayer({
            id: 'geojson-hover',
            type: 'fill',
            source: 'geojson',
            paint: {
                ...basePaint,
                'fill-color': '#155f9f',
                'fill-opacity': 0.9,
            },
            filter: ['==', idKey, ''],
        });
        map.addLayer({
            id: 'geojson-selected',
            type: 'fill',
            source: 'geojson',
            paint: {
                ...basePaint,
                'fill-color': '#6e599f',
                'fill-opacity': 0.5,
            },
            filter: getInFilter(idKey, selections),
        });

        this.layers = [...this.layers, 'geojson-stroke', 'geojson-fill', 'geojson-hover', 'geojson-selected'];
    }

    render() {
        const className = this.getClassName();

        return (
            <div
                className={className}
                ref={(el) => { this.mapElement = el; }}
            />
        );
    }
}
