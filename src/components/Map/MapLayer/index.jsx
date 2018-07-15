import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';


const propTypes = {
    map: PropTypes.object,
    type: PropTypes.string.isRequired,
    paint: PropTypes.object.isRequired,
    filter: PropTypes.array,

    layerKey: PropTypes.string.isRequired,
    sourceKey: PropTypes.string.isRequired,
    property: PropTypes.string,

    hoverInfo: PropTypes.shape({
        paint: PropTypes.object.isRequired,
    }),

    onClick: PropTypes.func,
};

const defaultProps = {
    map: undefined,
    property: undefined,
    filter: undefined,
    hoverInfo: undefined,
    onClick: undefined,
};


export default class MapLayer extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    eventHandlers = {};

    componentDidMount() {
        this.create(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.map !== nextProps.map) {
            this.destroy();
            this.create(nextProps);
        } else if (this.layer && this.props.paint !== nextProps.paint) {
            this.reloadPaint(nextProps);
        } else if (this.props.filter !== nextProps.filter) {
            this.reloadFilter(nextProps);
        }
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy = () => {
        const { map, layerKey } = this.props;
        if (map) {
            Object.keys(this.eventHandlers).forEach((type) => {
                const listener = this.eventHandlers[type];
                map.off(type, layerKey, listener);
            });
            if (this.layer) {
                map.removeLayer(this.layer);
            }
            if (this.hoverLayer) {
                map.removeLayer(this.hoverLayer);
            }
        }
        this.layer = undefined;
        this.hoverLayer = undefined;
    }

    create = (props) => {
        const {
            map,
            sourceKey,
            layerKey,
            type,
            paint,
            filter,
            onClick,
            property,
        } = props;

        map.addLayer({
            id: layerKey,
            source: sourceKey,
            type,
            paint,
        });
        this.layer = layerKey;

        if (filter) {
            map.setFilter(layerKey, filter);
        }

        if (onClick) {
            this.eventHandlers.click = (e) => {
                const feature = e.features[0];
                onClick(feature.properties[property]);
            }
        }

        this.createHoverLayer(props);

        Object.keys(this.eventHandlers).forEach((type) => {
            const listener = this.eventHandlers[type];
            map.on(type, layerKey, listener);
        });
    }

    createHoverLayer = ({ map, sourceKey, layerKey, property, type, hoverInfo }) => {
        if (!hoverInfo) {
            return;
        }
        const hoverLayerKey = `${layerKey}-hover`;

        const {
            paint,
        } = hoverInfo;

        map.addLayer({
            id: hoverLayerKey,
            source: sourceKey,
            type,
            paint,
            filter: ['==', property, ''],
        });

        this.hoverLayer = hoverLayerKey;

        // this.eventHandlers.mouseenter = (e) => {
        //     const feature = e.features[0];
        // }

        this.eventHandlers.mousemove = (e) => {
            const feature = e.features[0];
            map.setFilter(hoverLayerKey, ['==', property, feature.properties[property]]);
            map.getCanvas().style.cursor = 'pointer';
        }

        this.eventHandlers.mouseleave = () => {
            map.setFilter(hoverLayerKey, ['==', property, '']);
            map.getCanvas().style.cursor = '';
        }
    }

    reloadPaint = (props) => {
        const {
            map,
            layerKey,
            paint,
        } = props;

        Object.entries(paint).forEach((paintData) => {
            map.setPaintProperty(layerKey, paintData[0], paintData[1]);
        });
    }

    reloadFilter = (props) => {
        const {
            map,
            layerKey,
            filter,
        } = props;
        map.setFilter(layerKey, filter);
    }

    render() {
        return null;
    }
}
