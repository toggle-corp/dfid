import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';


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
        geoJson: PropTypes.object,
        style: PropTypes.oneOfType([
            stylePropType,
            PropTypes.objectOf(stylePropType),
        ]),
        idKey: PropTypes.string,
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
    },
};


export default class MapLayer extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

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
        if (this.layer) {
            this.layer.remove();
        }
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

        const highlightedLayers = [];
        this.layer = L.geoJSON(geoJson, {
            onEachFeature: (feature, layer) => {
                this.handleMapFeature(feature, layer, props);
                const featureId = feature.properties[properties.idKey];
                const layerStyle = properties.style && properties.style[featureId];
                if (layerStyle && layerStyle.isHighlighted) {
                    highlightedLayers.push(layer);
                }
            },
            pointToLayer: (feature, latlng) => {
                const featureId = feature.properties[properties.idKey];
                return new L.CircleMarker(latlng, {
                    radius: 10,
                    ...this.getStyle(properties.style, featureId),
                });
            },
        }).addTo(map);
        highlightedLayers.forEach(layer => layer.bringToFront());

        if (properties.zoomOnLoad) {
            map.fitBounds(this.layer.getBounds());
        }
    }

    handleMapFeature = (feature, layer, props) => {
        const { properties } = props;
        const featureId = feature.properties[properties.idKey];
        const featureLabel = feature.properties[properties.labelKey];

        if (!layer || !layer.setStyle) {
            return;
        }

        layer.setStyle(this.getStyle(properties.style, featureId));

        layer.on('mouseover', () => {
            const { properties } = this.props;
            if (properties.handleHover) {
                layer.setStyle(
                    this.getStyle(properties.style, featureId, { color: 'hoverColor' })
                );
            }
        });

        layer.on('mouseout', () => {
            const { properties } = this.props;
            if (properties.handleHover) {
                layer.setStyle(this.getStyle(properties.style, featureId));
            }
        });

        layer.on('mouseup', () => {
            const { properties } = this.props;
            if (properties.onClick) {
                properties.onClick(featureId);
            }
        });

        if (featureLabel) {
            layer.bindTooltip(String(featureLabel), {
                sticky: true,
            });
        }
    }

    getStyle = (style={}, key, styleKeys={}) => {
        let inputStyle = style;
        if (Object.keys(style).indexOf(String(key)) >= 0) {
            inputStyle = style[key];
        }

        return {
            color: inputStyle[styleKeys.stroke || 'stroke'],
            weight: inputStyle[styleKeys.strokeWeight || 'strokeWeight'] || 1.0,
            fillColor: inputStyle[styleKeys.color || 'color'],
            fillOpacity: inputStyle[styleKeys.opacity || 'opacity'] || 1.0,
        }
    }

    render() {
        return null;
    }
}
