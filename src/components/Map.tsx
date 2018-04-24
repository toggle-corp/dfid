import React from 'react';
import mapboxgl from 'mapbox-gl';

type Selections = (string|number)[];

type Geojson = string;

interface MapMouseEvent extends mapboxgl.MapMouseEvent {
    features: GeoJSON.Feature<mapboxgl.GeoJSONGeometry>;
}

interface OwnProps {
    className: string;
    geojson: Geojson;
    idKey: string;
    labelKey: string;
    // eslint-disable-next-line react/no-unused-prop-types
    colorMapping?: {
        [key: string]: string;
    };
    // eslint-disable-next-line react/no-unused-prop-types
    strokeColor?: string;

    selections?: Selections;
    onClick?(key: string): void;
}

type Props = OwnProps;

interface States {
    map: mapboxgl.Map;
}

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
};

const getInFilter = (key: string, values?: Selections) => {
    if (!values) {
        return;
    }
    if (values.length === 0) {
        return ['in', key, ''];
    }

    return ['in', key, ...values];
};


export default class Map extends React.PureComponent<Props, States> {
    mounted: boolean;
    layers: string[];
    sources: string[];
    mapElement: HTMLElement;

    static defaultProps = defaultProps;

    constructor(props: Props) {
        super(props);

        this.layers = [];
        this.sources = [];
    }

    componentDidMount() {
        this.mounted = true;

        const { REACT_APP_MAPBOX_ACCESS_TOKEN: token } = process.env;
        // Add the mapbox map
        if (token) {
            mapboxgl.accessToken = token;
        }
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

        setTimeout(() => { map.resize(); }, 200);

        this.initializeMap(map);
    }

    componentWillReceiveProps(nextProps: Props) {
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
                stops: Object.entries(colorMapping || Map.defaultProps.colorMapping),
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

    handleMouseOver = (id: string) => {
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
    initializeMap = (map: mapboxgl.Map) => {
        const { idKey, labelKey } = this.props;

        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
        });

        map.on('zoom', (e: MapMouseEvent) => {
            if (e.originalEvent) {
                popup.setLngLat(map.unproject([
                    e.originalEvent.offsetX,
                    e.originalEvent.offsetY - 8,
                ]));
            }
        });

        map.on('mouseenter', 'geojson-fill', (e: MapMouseEvent) => {
            const feature = e.features[0];
            popup.setHTML(feature.properties[labelKey])
                .addTo(map);
        });

        map.on('mousemove', 'geojson-fill', (e: MapMouseEvent) => {
            const feature = e.features[0];
            map.setFilter('geojson-hover', ['==', idKey, feature.properties[idKey]]);
            map.getCanvas().style.cursor = 'pointer';

            popup.setLngLat(map.unproject([
                e.point.x,
                e.point.y - 8,
            ])).setHTML(feature.properties[labelKey]);
        });

        map.on('mouseleave', 'geojson-fill', () => {
            map.setFilter('geojson-hover', ['==', idKey, '']);
            map.getCanvas().style.cursor = '';

            popup.remove();
        });

        map.on('click', 'geojson-fill', (e: MapMouseEvent) => {
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

    loadMapLayers(props: Props) {
        const { map } = this.state;
        const {
            colorMapping,
            geojson, idKey, selections,
            strokeColor,
        } = props;

        if (!map || !geojson) {
            return;
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

        const basePaint: mapboxgl.FillPaint = {
            'fill-color': {
                property: idKey,
                type: 'categorical',
                stops: Object.entries(colorMapping || Map.defaultProps.colorMapping),
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

        this.layers = [
            ...this.layers,
            'geojson-stroke',
            'geojson-fill',
            'geojson-hover',
            'geojson-selected',
        ];
    }

    render() {
        const className = this.getClassName();

        return (
            <div
                className={className}
                ref={(el: HTMLDivElement) => { this.mapElement = el; }}
            />
        );
    }
}
