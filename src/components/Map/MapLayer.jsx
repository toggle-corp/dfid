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
            renderer,
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
                return new L.circle(latlng, {
                    renderer,
                    ...this.getStyle(properties.style, featureId),
                    radius: 2000,
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

        if (featureLabel) {
            layer.bindTooltip(String(featureLabel), {
                sticky: true,
            });
        }

        if (!layer.setStyle) {
            return;
        }

        layer.setStyle(this.getStyle(properties.style, featureId));

        if (properties.handleHover) {
            layer.on('mouseover', () => {
                const { properties } = this.props;
                layer.setStyle(
                    this.getStyle(properties.style, featureId, { color: 'hoverColor' })
                );
            });
        }

        if (properties.handleHover) {
            layer.on('mouseout', () => {
                const { properties } = this.props;
                layer.setStyle(this.getStyle(properties.style, featureId));
            });
        }

        if (properties.onClick) {
            layer.on('mouseup', () => {
                const { properties } = this.props;
                properties.onClick(featureId);
            });
        }
    }

    getStyle = (style={}, key, styleKeys={}) => {
        let inputStyle = style;
        if (Object.keys(style).indexOf(String(key)) >= 0) {
            inputStyle = style[key];
        }

        const color = inputStyle[styleKeys.color || 'color'];

        return {
            color: inputStyle[styleKeys.stroke || 'stroke'] || color,
            weight: inputStyle[styleKeys.strokeWeight || 'strokeWeight'] || 1.0,
            fillColor: color,
            fillOpacity: inputStyle[styleKeys.opacity || 'opacity'] || 1.0,
        }
    }

    render() {
        return null;
    }
}
