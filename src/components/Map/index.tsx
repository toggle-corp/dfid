import React from 'react';
import mapboxgl from 'mapbox-gl';
import MapLayer, { MapContext, GeoJSON } from './MapLayer';

export interface LayerInfo {
    layerKey: string;
    order: number;
    geoJson: GeoJSON;
    type: string;
    separateStroke?: boolean;
    strokeColor?: string;
    color?: string;
    opacity?: number;
    visibilityKey?: string;
    idKey?: string;
    labelKey?: string;
    zoomOnLoad?: boolean;
    handleHover?: boolean;
    showPopUp?: boolean;
    onClick?(key: String): void;
}

interface OwnProps {
    className: string;
    layers: { [key: string]: LayerInfo };
    hideLayers?: boolean;
}

type Props = OwnProps;

interface States {
    map?: mapboxgl.Map;
}

const defaultProps = {
    className: '',
};


export default class Map extends React.PureComponent<Props, States> {
    mounted: boolean;
    layers: string[];
    sources: string[];
    mapElement: HTMLDivElement;

    sortedLayers: LayerInfo[];
    reloadKey: number;

    static defaultProps = defaultProps;

    static generateSortedLayers = (layers: Props['layers']) => ([
        ...Object.values(layers)
            .sort((l1, l2) => l1.order - l2.order),
        ...Object.values(layers)
            .filter(l => l.separateStroke)
            .sort((l1, l2) => l1.order - l2.order)
            .map(l => ({
                order: 0,
                layerKey: `${l.layerKey}-stroke`,
                type: 'Line',
                geoJson: l.geoJson,
                color: l.strokeColor || l.color,
                opacity: l.opacity,
            })),
    ])

    constructor(props: Props) {
        super(props);

        this.layers = [];
        this.sources = [];
        this.state = {
            map: undefined,
        };
        this.sortedLayers = [];

        this.reloadKey = 0;
    }

    componentDidMount() {
        this.mounted = true;

        if (!this.props.hideLayers) {
            this.sortedLayers = Map.generateSortedLayers(this.props.layers);
            this.reloadKey += 1;
        }

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
                this.setState({ map });
            }
        });

        setTimeout(() => { map.resize(); }, 200);
    }

    componentWillReceiveProps(nextProps: Props) {
        const {
            hideLayers: oldHideLayers,
            layers: oldLayers,
        } = this.props;
        const {
            hideLayers: newHideLayers,
            layers: newLayers,
        } = nextProps;

        if (
            (!newHideLayers && oldHideLayers !== newHideLayers) ||
            (!newHideLayers && oldLayers !== newLayers)
        ) {
            this.sortedLayers = Map.generateSortedLayers(newLayers);
            this.reloadKey += 1;
        }
    }

    componentWillUnmount() {
        this.mounted = false;

        // Remove the mapbox map
        const { map } = this.state;
        if (map) {
            this.setState({ map: undefined }, () => {
                map.remove();
            });
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

    render() {
        const className = this.getClassName();
        const { hideLayers } = this.props;

        const { map } = this.state;

        const mapContextData = {
            map,
        };


        return (
            <div
                className={className}
                ref={(el: HTMLDivElement) => { this.mapElement = el; }}
            >
                <MapContext.Provider value={mapContextData}>
                    {
                        !hideLayers && this.sortedLayers.map((l: LayerInfo, index: number) => (
                            <MapLayer
                                key={`${l.layerKey}-layer-${this.reloadKey}`}
                                fill={l.type === 'Fill'}
                                stroke={l.type === 'Line'}
                                point={l.type === 'Point'}
                                {...l}
                            />
                        ))
                    }
                </MapContext.Provider>
            </div>
        );
    }
}
