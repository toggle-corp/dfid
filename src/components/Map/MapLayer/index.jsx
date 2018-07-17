import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';
import styles from './styles.scss';

const renderInto = (container, component) => (
    ReactDOM.render(component, container)
);


const propTypes = {
    map: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    paint: PropTypes.object.isRequired,
    layout: PropTypes.object,
    filter: PropTypes.array,

    layerKey: PropTypes.string.isRequired,
    sourceKey: PropTypes.string.isRequired,
    property: PropTypes.string,

    hoverInfo: PropTypes.shape({
        paint: PropTypes.object.isRequired,
        showTooltip: PropTypes.bool,
        tooltipProperty: PropTypes.string,
        tooltipModifier: PropTypes.func,
    }),

    onClick: PropTypes.func,
};

const defaultProps = {
    layout: undefined,
    filter: undefined,
    property: undefined,
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
        } else if (this.layer) {
            if (this.props.layout !== nextProps.layout) {
                this.reloadLayout(nextProps);
            }
            if (this.props.paint !== nextProps.paint) {
                this.reloadPaint(nextProps);
            }
            if (this.props.filter !== nextProps.filter) {
                this.reloadFilter(nextProps);
            }
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
            if (this.popup) {
                this.popup.remove();
            }
        }
        this.layer = undefined;
        this.hoverLayer = undefined;
        this.popup = undefined;
    }

    create = (props) => {
        const {
            map,
            sourceKey,
            layerKey,
            type,
            paint,
            layout,
            filter,
            onClick,
            property,
        } = props;

        const layerInfo = {
            id: layerKey,
            source: sourceKey,
            type,
            paint,
        };

        if (layout) {
            layerInfo.layout = layout;
        }
        if (filter) {
            layerInfo.filter = filter;
        }

        map.addLayer(layerInfo);
        this.layer = layerKey;

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

    createHoverLayer = ({
        map,
        sourceKey,
        layerKey,
        property,
        type,
        hoverInfo,
    }) => {
        if (!hoverInfo) {
            return;
        }
        const hoverLayerKey = `${layerKey}-hover`;

        const {
            paint,
            showTooltip,
        } = hoverInfo;

        map.addLayer({
            id: hoverLayerKey,
            source: sourceKey,
            type,
            paint,
            filter: ['==', property, ''],
        });

        this.hoverLayer = hoverLayerKey;

        let popup;
        let tooltipContainer;

        if (showTooltip) {
            tooltipContainer = document.createElement('div');
            popup = new mapboxgl.Marker(tooltipContainer, {
                offset: [0, -10],
            }).setLngLat([0, 0]);
            this.popup = popup;

            map.on('zoom', (e) => {
                if (e.originalEvent && this.popup) {
                    this.popup.setLngLat(map.unproject([
                        e.originalEvent.offsetX,
                        e.originalEvent.offsetY - 8,
                    ]));
                }
            });
        }

        this.eventHandlers.mouseenter = (e) => {
            const feature = e.features[0];
            if (popup) {
                popup.addTo(map);
                renderInto(tooltipContainer, this.renderTooltip(feature.properties));
                popup.setOffset([0, -tooltipContainer.clientHeight / 2]);
            }
        }

        this.eventHandlers.mousemove = (e) => {
            const feature = e.features[0];
            map.setFilter(hoverLayerKey, ['==', property, feature.properties[property]]);
            map.getCanvas().style.cursor = 'pointer';

            if (popup) {
                popup.setLngLat(map.unproject([
                    e.point.x,
                    e.point.y - 8,
                ]));
                renderInto(tooltipContainer, this.renderTooltip(feature.properties));
                popup.setOffset([0, -tooltipContainer.clientHeight / 2]);
            }
        }

        this.eventHandlers.mouseleave = () => {
            map.setFilter(hoverLayerKey, ['==', property, '']);
            map.getCanvas().style.cursor = '';

            if (popup) {
                popup.remove();
            }
        }
    }

    reloadLayout = (props) => {
        const {
            map,
            layerKey,
            layout,
        } = props;

        Object.entries(layout).forEach((layoutData) => {
            map.setLayoutProperty(layerKey, layoutData[0], layoutData[1]);
        });
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

    renderTooltip = (properties) => {
        const { hoverInfo: { tooltipProperty, tooltipModifier } } = this.props;

        if (tooltipModifier) {
            return tooltipModifier(properties);
        }

        return (
            <div className={styles.tooltip}>
                { properties[tooltipProperty] }
            </div>
        );
    }

    render() {
        return null;
    }
}
