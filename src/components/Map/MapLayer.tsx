import React from 'react';
import mapboxgl from 'mapbox-gl';
import turf from 'turf';

export type GeoJSON = any;

interface MapMouseEvent extends mapboxgl.MapMouseEvent {
    features: GeoJSON.Feature<mapboxgl.GeoJSONGeometry>;
}

interface Props {
    layerKey: string;

    map?: mapboxgl.Map;
    geoJson: GeoJSON;

    idKey?: string;
    labelKey?: string;
    visibilityKey?: string;

    color?: string;
    opacity?: number;

    point?: boolean;
    fill?: boolean;
    stroke?: boolean;

    handleHover?: boolean;
    showPopUp?: boolean;

    onClick?(key: String): void;
    zoomOnLoad?: boolean;
}

interface States {
}

class MapLayer extends React.PureComponent<Props, States> {
    sources: string[];
    layers: string[];

    constructor(props: Props) {
        super(props);

        this.sources = [];
        this.layers = [];
    }

    componentDidMount() {
        if (this.props.map) {
            this.create(this.props);
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        if (
            this.props.map !== nextProps.map ||
            this.props.geoJson !== nextProps.geoJson
        ) {
            this.destroy();
            this.create(nextProps);
        }
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy() {
        const { map } = this.props;
        if (map) {
            console.warn(map);
            this.layers.forEach(layer => map.removeLayer(layer));
            this.sources.forEach(source => map.removeSource(source));
        }
        this.layers = [];
        this.sources = [];
    }

    create(props: Props) {
        const {
            map,
            geoJson,
            layerKey,
            point,
            fill,
            stroke,
            color,
            opacity,
            zoomOnLoad,
        } = props;

        if (!map || !geoJson) {
            return;
        }

        if (zoomOnLoad) {
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

        map.addSource(layerKey, {
            type: 'geojson',
            data: geoJson,
        });
        this.sources.push(layerKey);

        let handleHover = props.handleHover;

        if (fill) {
            this.createMapBoxLayer(props, 'fill', color || '#1676d3', handleHover);
            handleHover = false;
        }
        if (point) {
            this.createMapBoxLayer(props, 'circle', color || '#1676d3', handleHover);
            handleHover = false;
        }
        if (stroke) {
            this.createMapBoxLayer(
                props,
                'line',
                color || '#fff',
                handleHover,
                {
                    'line-width': 1,
                    'line-opacity': opacity || 1,
                },
            );
        }
    }

    createMapBoxLayer = (
        props: Props,
        layerType: 'fill' | 'circle' | 'line',
        color: string,
        handleHover?: boolean,
        extraParams: object = {},
    ) => {
        const {
            map,
            opacity,
            layerKey,
            idKey,
            visibilityKey,
            showPopUp,
        } = props;

        if (!map) {
            return;
        }

        const colorKey = `${layerType}-color`;
        const opacityKey = `${layerType}-opacity`;

        map.addLayer({
            id: `${layerKey}-${layerType}`,
            type: layerType,
            source: layerKey,
            paint: {
                [colorKey]: color,
                [opacityKey]: opacity || 0.8,
                ...extraParams,
            },
        });

        this.layers.push(`${layerKey}-${layerType}`);

        if (handleHover) {
            map.addLayer({
                id: `${layerKey}-${layerType}-hover`,
                type: 'fill',
                source: layerKey,
                paint: {
                    [colorKey]: '#005ea5',
                    [opacityKey]: opacity || 0.8,
                    ...extraParams,
                },
                filter: ['==', idKey, ''],
            });

            this.layers.push(`${layerKey}-${layerType}-hover`);
            this.handleHover(
                map,
                `${layerKey}-${layerType}`,
                showPopUp,
            );
        }

        if (visibilityKey) {
            map.setFilter(`${layerKey}-${layerType}`, ['!=', visibilityKey, '']);
        }
    }

    handleHover = (
        map: mapboxgl.Map,
        layerId: string,
        showPopUp?: boolean,
    ) => {
        const hoverLayerId = `${layerId}-hover`;
        let popup: mapboxgl.Popup;

        if (showPopUp) {
            popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
            });
        }

        map.on('zoom', (e: MapMouseEvent) => {
            if (e.originalEvent) {
                popup.setLngLat(map.unproject([
                    e.originalEvent.offsetX,
                    e.originalEvent.offsetY - 8,
                ]));
            }
        });

        map.on('mouseenter', layerId, (e: MapMouseEvent) => {
            const { labelKey = '' } = this.props;
            const feature = e.features[0];
            popup.setHTML(feature.properties[labelKey]).addTo(map);
        });

        map.on('mousemove', layerId, (e: MapMouseEvent) => {
            const { idKey = '', labelKey = '' } = this.props;
            const feature = e.features[0];
            map.setFilter(hoverLayerId, ['==', idKey, feature.properties[idKey]]);
            map.getCanvas().style.cursor = 'pointer';

            popup.setLngLat(map.unproject([
                e.point.x,
                e.point.y - 8,
            ])).setHTML(feature.properties[labelKey]);
        });

        map.on('mouseleave', layerId, () => {
            const { idKey } = this.props;
            map.setFilter(hoverLayerId, ['==', idKey, '']);
            map.getCanvas().style.cursor = '';

            popup.remove();
        });

        map.on('click', layerId, (e: MapMouseEvent) => {
            const { idKey, onClick } = this.props;
            if (onClick && idKey) {
                const feature = e.features[0];
                onClick(feature.properties[idKey]);
            }
        });
    }

    render() {
        return null;
    }
}


interface MapContextData {
    map?: mapboxgl.Map;
}

export const MapContext = React.createContext<MapContextData>({ // tslint:disable-line
    map: undefined,
});

function MapLayerHOC(Component: React.ComponentType<Props>) { // tslint:disable-line
    return class WrappedComponent extends React.PureComponent<Props> {
        render() {
            return (
                <MapContext.Consumer>
                {(data: MapContextData) => (
                    <Component
                        {...this.props}
                        map={data.map}
                    />
                )}
                </MapContext.Consumer>
            );
        }
    };
}

export default MapLayerHOC(MapLayer);
