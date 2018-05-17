import React from 'react';
import mapboxgl from 'mapbox-gl';
import turf from 'turf';

type Selections = (string|number)[];
export type GeoJSON = any;

interface MapMouseEvent extends mapboxgl.MapMouseEvent {
    features: GeoJSON.Feature<mapboxgl.GeoJSONGeometry>;
}

export interface Layer {
    geoJson: GeoJSON;
    type: string;
    key: string;
}

interface OwnProps {
    className: string;
    geojson: GeoJSON;
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

    layers?: Layer[];
}

type Props = OwnProps;

interface States {
    map?: mapboxgl.Map;
}

const defaultProps = {
    className: '',
    geojson: undefined,
    idKey: '',
    labelKey: '',
    colorMapping: {
        undefined: '#1676d3',
    },
    strokeColor: '#fff',

    selections: [],
    onClick: undefined,
    layers: [],
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

const sameArrays = (a1?: any[], a2?: any[]) => {
    if (a1 === a2) {
        return false;
    }

    if (!a1 || !a2) {
        return false;
    }

    if (a1.length !== a2.length) {
        return false;
    }

    for (let i = 0; i < a1.length; i += 1) {
        if (a1[i] !== a2[i]) {
            return false;
        }
    }

    return true;
};

export default class Map extends React.PureComponent<Props, States> {
    mounted: boolean;
    layers: string[];
    sources: string[];
    mapElement: HTMLDivElement;

    static defaultProps = defaultProps;

    constructor(props: Props) {
        super(props);

        this.layers = [];
        this.sources = [];
        this.state = {};
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
        if (this.props.geojson !== nextProps.geojson ||
            !sameArrays(this.props.layers, nextProps.layers)) {
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
                default: '#1676d3',
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
            const { labelKey } = this.props;
            const feature = e.features[0];
            popup.setHTML(feature.properties[labelKey])
                .addTo(map);
        });

        map.on('mousemove', 'geojson-fill', (e: MapMouseEvent) => {
            const { idKey, labelKey } = this.props;
            const feature = e.features[0];
            map.setFilter('geojson-hover', ['==', idKey, feature.properties[idKey]]);
            map.getCanvas().style.cursor = 'pointer';

            popup.setLngLat(map.unproject([
                e.point.x,
                e.point.y - 8,
            ])).setHTML(feature.properties[labelKey]);
        });

        map.on('mouseleave', 'geojson-fill', () => {
            const { idKey } = this.props;
            map.setFilter('geojson-hover', ['==', idKey, '']);
            map.getCanvas().style.cursor = '';

            popup.remove();
        });

        map.on('click', 'geojson-fill', (e: MapMouseEvent) => {
            const { idKey } = this.props;
            if (this.props.onClick) {
                const feature = e.features[0];
                this.props.onClick(feature.properties[idKey]);
            }
        });
    }
    /* eslint-enable no-param-reassign */

    destroyMapLayers() {
        const { map } = this.state;
        if (map) {
            this.layers.forEach(layer => map.removeLayer(layer));
            this.sources.forEach(source => map.removeSource(source));
        }
        this.layers = [];
        this.sources = [];
    }

    loadMapLayers(props: Props) {
        const { map } = this.state;
        const {
            colorMapping,
            geojson, idKey, selections,
            strokeColor,
            layers,
        } = props;

        if (!map || !geojson) {
            return;
        }

        this.flyToBounds(geojson);

        if (this.sources.length > 0 || this.layers.length > 0) {
            this.destroyMapLayers();
        }

        const basePaint: mapboxgl.FillPaint = {
            'fill-color': {
                property: idKey,
                type: 'categorical',
                stops: Object.entries(colorMapping || Map.defaultProps.colorMapping),
                default: '#1676d3',
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
            id: 'geojson-hover',
            type: 'fill',
            source: 'geojson',
            paint: {
                ...basePaint,
                'fill-color': '#005ea5',
                'fill-opacity': 0.8,
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

        map.addLayer({
            id: 'geojson-stroke',
            type: 'line',
            source: 'geojson',
            paint: {
                'line-color': strokeColor,
                'line-width': 1,
            },
        });

        this.layers = [
            'geojson-stroke',
            'geojson-fill',
            'geojson-hover',
            'geojson-selected',
        ];

        if (layers) {
            layers.forEach((layer) => {
                map.addSource(layer.key, {
                    type: 'geojson',
                    data: layer.geoJson,
                });
                this.sources.push(layer.key);

                if (layer.type === 'Polygon') {
                    map.addLayer({
                        id: layer.key,
                        type: 'line',
                        source: layer.key,
                        paint: {
                            'line-color': '#FFA80D',
                            'line-width': 2,
                        },
                    });
                } else {
                    map.addLayer({
                        id: layer.key,
                        type: 'circle',
                        source: layer.key,
                        paint: {
                            'circle-color': '#FFA80D',
                        },
                    });
                }
                this.layers.push(layer.key);
            });
        }
    }

    flyToBounds = (geoJson: GeoJSON) => {
        const { map } = this.state;
        if (!map) {
            return;
        }

        const bounds = turf.bbox(geoJson);
        map.fitBounds(
            [[
                bounds[0],
                bounds[1],
            ], [
                bounds[2],
                bounds[3],
            ]],
            { padding: 128 },
        );
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
