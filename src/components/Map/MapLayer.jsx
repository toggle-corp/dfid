import React from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';
import turf from 'turf';
import { mapToList } from '../../vendor/react-store/utils/common';


const stylePropType = PropTypes.shape({
    color: PropTypes.string,
    stroke: PropTypes.string,
    strokeWeight: PropTypes.number,
    opacity: PropTypes.number,
    hoverColor: PropTypes.string,
    isHighlighted: PropTypes.bool,
});


const propTypes = {
    map: PropTypes.object,
    properties: PropTypes.shape({
        types: PropTypes.arrayOf(PropTypes.oneOf(['Polygon', 'Line', 'Point'])),
        layerKey: PropTypes.string,
        geoJson: PropTypes.object,
        style: PropTypes.oneOfType([
            stylePropType,
            PropTypes.objectOf(stylePropType),
        ]),
        stylePerElement: PropTypes.bool,
        idKey: PropTypes.string,
        integerId: PropTypes.bool,
        labelKey: PropTypes.string,
        handleHover: PropTypes.bool,
        zoomOnLoad: PropTypes.bool,
        onClick: PropTypes.func,
    }),
};

const defaultProps = {
    map: undefined,
    properties: {
        zoomOnLoad: false,
        handleHover: false,
        stylePerElement: false,
    },
};


export default class MapLayer extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.sources = [];
        this.layers = [];
    }

    componentDidMount() {
        this.load(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.map !== this.props.map ||
            nextProps.geoJson !== this.props.geoJson ||
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
            this.layers.forEach(layer => map.removeLayer(layer));
            this.sources.forEach(source => map.removeSource(source));
        }
        this.layers = [];
        this.sources = [];
    }

    load = (props) => {
        const {
            map,
            geoJson,
            properties,
        } = props;

        if (!map || !geoJson) {
            return;
        }

        // TODO Remove isHighlighted prop

        if (properties.zoomOnLoad) {
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
                },
            });
        }

        if (properties.types.indexOf('Point') >= 0) {
            this.createMapBoxLayer({
                ...properties,
                map,
                layerType: 'circle',
                paint: {
                    'circle-color': this.getPaintData(properties, 'color'),
                    'circle-opacity': this.getPaintData(properties, 'opacity', 0.65),
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
        paint,
        hoverPaint = undefined,
    }) => {
        map.addLayer({
            id: `${layerKey}-${layerType}`,
            type: layerType,
            source: layerKey,
            paint,
        });
        this.layers.push(`${layerKey}-${layerType}`);

        if (hoverPaint) {
            map.addLayer({
                id: `${layerKey}-${layerType}-hover`,
                type: layerType,
                source: layerKey,
                paint: hoverPaint,
                filter: ['==', idKey, ''],
            });

            this.layers.push(`${layerKey}-${layerType}-hover`);
            this.handleHover(map, `${layerKey}-${layerType}`, labelKey);
        }
    }

    handleHover = (map, layerId, labelKey) => {
        const hoverLayerId = `${layerId}-hover`;
        let popup;

        if (labelKey) {
            popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
            });
        }

        map.on('zoom', (e) => {
            if (e.originalEvent && popup) {
                popup.setLngLat(map.unproject([
                    e.originalEvent.offsetX,
                    e.originalEvent.offsetY - 8,
                ]));
            }
        });

        map.on('mouseenter', layerId, (e) => {
            const { properties: { idKey = '', labelKey = '' } } = this.props;
            const feature = e.features[0];
            if (popup) {
                popup.setHTML(feature.properties[labelKey]).addTo(map);
            }
        });

        map.on('mousemove', layerId, (e) => {
            const { properties: { idKey = '', labelKey = '' } } = this.props;
            const feature = e.features[0];
            map.setFilter(hoverLayerId, ['==', idKey, feature.properties[idKey]]);
            map.getCanvas().style.cursor = 'pointer';

            if (popup) {
                popup.setLngLat(map.unproject([
                    e.point.x,
                    e.point.y - 8,
                ])).setHTML(feature.properties[labelKey]);
            }
        });

        map.on('mouseleave', layerId, () => {
            const { properties: { idKey = '', labelKey = '' } } = this.props;
            map.setFilter(hoverLayerId, ['==', idKey, '']);
            map.getCanvas().style.cursor = '';

            if (popup) {
                popup.remove();
            }
        });

        map.on('click', layerId, (e) => {
            const { properties: { idKey, onClick } } = this.props;
            if (onClick && idKey) {
                const feature = e.features[0];
                onClick(feature.properties[idKey]);
            }
        });
    }

    getPaintData = (properties, key, defaultValue) => {
        const style = properties.style;
        if (!properties.stylePerElement) {
            return style[key] || defaultValue;
        }

        if (properties.integerId) {
            return {
                property: properties.idKey,
                type: 'categorical',
                stops: mapToList(style, (v, k) => [parseInt(k, 10), v[key] || defaultValue]),
            };
        }

        return {
            property: properties.idKey,
            type: 'categorical',
            stops: mapToList(style, (v, k) => [k, v[key] || defaultValue]),
        };
    }

    render() {
        return null;
    }
}
