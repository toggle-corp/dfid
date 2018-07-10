import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';
import turf from 'turf';
import { isTruthy, mapToList } from '../../../vendor/react-store/utils/common';
import styles from './styles.scss';


const stylePropType = PropTypes.shape({
    color: PropTypes.string,
    stroke: PropTypes.string,
    strokeWeight: PropTypes.number,
    opacity: PropTypes.number,
    hoverColor: PropTypes.string,
});


const propTypes = {
    map: PropTypes.object,
    properties: PropTypes.shape({
        types: PropTypes.arrayOf(PropTypes.oneOf(['Polygon', 'Line', 'Point', 'Tile', 'Text'])),
        layerKey: PropTypes.string,
        geoJson: PropTypes.object,
        style: PropTypes.oneOfType([
            stylePropType,
            PropTypes.objectOf(stylePropType),
        ]),
        stylePerElement: PropTypes.bool,
        visibleCondition: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.any)),
        idKey: PropTypes.string,
        integerId: PropTypes.bool,
        labelKey: PropTypes.string,
        handleHover: PropTypes.bool,
        onClick: PropTypes.objectOf(PropTypes.func),
    }),
};

const defaultProps = {
    map: undefined,
    properties: {
        handleHover: false,
        stylePerElement: false,
    },
};


const renderInto = (container, component) => (
    ReactDOM.render(component, container)
);

export default class MapLayer extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.sources = [];
        this.layers = [];
        this.eventHandlers = {};
        this.popups = {};
    }

    componentDidMount() {
        this.load(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.map !== this.props.map ||
            nextProps.properties !== this.props.properties
        ) {
            this.destroy();
            this.load(nextProps);
        }
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy = () => {
        const { map } = this.props;
        if (map) {
            Object.keys(this.eventHandlers).forEach((layerId) => {
                const handlers = this.eventHandlers[layerId];
                Object.keys(handlers).forEach((type) => {
                    const listener = handlers[type];
                    map.off(type, layerId, listener);
                });
            });
            Object.values(this.popups).forEach((popup) => {
                popup.remove();
            });
            this.layers.forEach(layer => map.removeLayer(layer));
            this.sources.forEach(source => map.removeSource(source));
        }
        this.eventHandlers = {};
        this.popups = {};
        this.layers = [];
        this.sources = [];
    }

    load = (props) => {
        const {
            map,
            properties,
        } = props;

        if (!map) {
            return;
        }

        const { geoJson } = properties;

        if (properties.types.indexOf('Tile') >= 0) {
            this.createMapBoxTileLayer({
                ...properties,
                map,
            });
        }

        if (!geoJson) {
            return;
        }

        map.addSource(properties.layerKey, {
            type: 'geojson',
            data: geoJson,
        });
        this.sources.push(properties.layerKey);

        if (properties.types.indexOf('Polygon') >= 0) {
            this.createMapBoxLayer({
                ...properties,
                map,
                layerType: 'fill',
                paint: {
                    'fill-color': this.getPaintData(properties, 'color'),
                    'fill-opacity': this.getPaintData(properties, 'opacity', 0.65),
                },
                hoverPaint: properties.handleHover && ({
                    'fill-color': this.getPaintData(properties, 'hoverColor'),
                    'fill-opacity': this.getPaintData(properties, 'hoverOpacity'),
                }),
            });
        }

        if (properties.types.indexOf('Line') >= 0) {
            this.createMapBoxLayer({
                ...properties,
                map,
                layerType: 'line',
                paint: {
                    'line-color': this.getPaintData(properties, 'stroke'),
                    'line-width': this.getPaintData(properties, 'strokeWidth', 1),
                    'line-opacity': this.getPaintData(properties, 'strokeOpacity', 1),
                },
            });
        }

        if (properties.types.indexOf('Point') >= 0) {
            const strokePaint = {
                'circle-stroke-color': this.getPaintData(properties, 'stroke', '#fff'),
                'circle-stroke-width': this.getPaintData(properties, 'strokeWidth', 0),
            };

            this.createMapBoxLayer({
                ...properties,
                map,
                layerType: 'circle',
                paint: {
                    'circle-color': this.getPaintData(properties, 'color'),
                    'circle-opacity': this.getPaintData(properties, 'opacity', 1),
                    ...strokePaint,
                },
                hoverPaint: properties.handleHover && ({
                    'circle-color': this.getPaintData(properties, 'hoverColor'),
                    'circle-opacity': this.getPaintData(properties, 'hoverOpacity', 1),
                }),
            });
        }

        if (properties.types.indexOf('Text') >= 0) {
            const textFieldData = this.getPaintData(properties, 'textField');
            const iconImageData = {
                ...textFieldData,
                stops: textFieldData.stops.map(d => [d[0], d[1] ? 'circle' : '']),
            };

            this.createMapBoxLayer({
                ...properties,
                map,
                layerType: 'symbol',
                layout: {
                    'text-field': textFieldData,
                    'text-size': {
                        stops: [[7, 0], [7.2, 11]],
                    },
                    'icon-image': iconImageData,
                    'icon-size': {
                        stops: [[7, 0], [7.2, 0.02]],
                    },
                },
                paint: {
                    'icon-opacity': 0.75,
                    'text-color': '#2a2a2a',
                },
            });
        }
    }

    createMapBoxLayer = ({
        map,
        layerKey,
        layerType,
        idKey,
        labelKey,
        visibleCondition,
        paint,
        layout = {},
        hoverPaint = undefined,
    }) => {
        const layerId = `${layerKey}-${layerType}`;

        map.addLayer({
            id: layerId,
            type: layerType,
            source: layerKey,
            layout,
            paint,
        });
        this.layers.push(layerId);

        if (hoverPaint) {
            map.addLayer({
                id: `${layerId}-hover`,
                type: layerType,
                source: layerKey,
                paint: hoverPaint,
                filter: ['==', idKey, ''],
            });

            this.layers.push(`${layerId}-hover`);
            this.handleHover(map, layerId, labelKey, layerType);
        }

        if (visibleCondition && visibleCondition[layerType]) {
            map.setFilter(layerId, visibleCondition[layerType]);
        }
    }

    createMapBoxTileLayer = ({
        map,
        layerKey,
        tiles,
        tileSize,
    }) => {
        map.addSource(layerKey, {
            type: 'raster',
            tiles,
            tileSize,
        });
        this.sources.push(layerKey);

        map.addLayer({
            id: `${layerKey}-layer`,
            type: 'raster',
            source: layerKey,
            paint: {}
        });
        this.layers.push(`${layerKey}-layer`);
    }

    handleHover = (map, layerId, labelKey, layerType) => {
        const hoverLayerId = `${layerId}-hover`;
        let popup;
        let tooltipContainer;

        if (labelKey) {
            tooltipContainer = document.createElement('div');
            popup = new mapboxgl.Marker(tooltipContainer, {
                offset: [0, -10],
            }).setLngLat([0, 0]);
            this.popups[layerId] = popup;
        }

        if (!this.eventHandlers[layerId]) {
            this.eventHandlers[layerId] = {};
        }
        const handlers = this.eventHandlers[layerId];

        map.on('zoom', (e) => {
            if (e.originalEvent && popup) {
                popup.setLngLat(map.unproject([
                    e.originalEvent.offsetX,
                    e.originalEvent.offsetY - 8,
                ]));
            }
        });

        handlers.mouseenter = (e) => {
            const { properties: { idKey = '', labelKey = '' } } = this.props;
            const feature = e.features[0];
            if (popup) {
                popup.addTo(map);
                renderInto(tooltipContainer, this.renderTooltip(feature.properties));
                popup.setOffset([0, -tooltipContainer.clientHeight / 2]);
            }
        };

        handlers.mousemove = (e) => {
            const { properties: { idKey = '', labelKey = '' } } = this.props;
            const feature = e.features[0];

            map.setFilter(hoverLayerId, ['==', idKey, feature.properties[idKey]]);
            map.getCanvas().style.cursor = 'pointer';

            if (popup) {
                popup.setLngLat(map.unproject([
                    e.point.x,
                    e.point.y - 8,
                ]));

                renderInto(tooltipContainer, this.renderTooltip(feature.properties));
                popup.setOffset([0, -tooltipContainer.clientHeight / 2]);
            }
        };

        handlers.mouseleave = () => {
            const { properties: { idKey = '', labelKey = '' } } = this.props;
            map.setFilter(hoverLayerId, ['==', idKey, '']);
            map.getCanvas().style.cursor = '';

            if (popup) {
                popup.remove();
            }
        };

        handlers.click = (e) => {
            const { properties: { idKey, labelKey, onClick } } = this.props;
            const feature = e.features[0];
            if (onClick && onClick[layerType] && idKey) {
                onClick[layerType](feature.properties[idKey], feature.properties[labelKey]);
            }
        };

        Object.keys(handlers).forEach((type) => {
            const listener = handlers[type];
            map.on(type, layerId, listener);
        });
    }

    getPaintData = (properties, key, defaultValue) => {
        const val = v => isTruthy(v) ? v : defaultValue;

        const style = properties.style;
        if (!properties.stylePerElement) {
            return val(style[key]);
        }

        if (properties.integerId) {
            return {
                property: properties.idKey,
                type: 'categorical',
                stops: mapToList(style, (v, k) => [parseInt(k, 10), val(v[key])]),
            };
        }

        return {
            property: properties.idKey,
            type: 'categorical',
            stops: mapToList(style, (v, k) => [k, val(v[key])]),
        };
    }

    renderTooltip = (properties) => {
        const { properties: { labelKey, tooltipModifier } } = this.props;

        if (tooltipModifier) {
            return tooltipModifier(properties);
        }

        return (
            <div className={styles.tooltip}>
                { properties[labelKey] }
            </div>
        );
    }

    render() {
        return null;
    }
}
