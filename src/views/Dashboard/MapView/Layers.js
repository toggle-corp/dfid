import React from 'react';
import { connect } from 'react-redux';

import { dashboardMapLayersSelector } from '../../../redux';

import { getPastelColorFromString } from '../../../utils/common';
import MapLayer from '../../../components/Map/MapLayer';
import GenericSource from './GenericSource';
import { getSimpleCategoricalPaint } from './utils';
import layerTypes, { icons, layerTypeKeys } from './layerTypes';

const mapStateToProps = state => ({
    selectedMapLayers: dashboardMapLayersSelector(state),
});

class Layers extends React.PureComponent {
    constructor(props) {
        super(props);
        const { map } = props;

        Object.keys(icons).forEach((layerType) => {
            icons[layerType].forEach((icon, index) => {
                const img = new Image(8, 8);
                img.onload = () => {
                    map.addImage(`map-icon-${layerType}-${index}`, img);
                };
                img.src = icon;
            });
        });
    }

    calculateProps = (layer) => {
        const color = getPastelColorFromString(layer.layerName);

        if (layer.type === 'Point') {
            return {
                type: 'circle',
                paint: {
                    'circle-radius': layerTypes[layer.id] ? 7 : 5,
                    'circle-color': color,
                    'circle-stroke-color': '#404040',
                    'circle-stroke-width': layerTypes[layer.id] ? 0 : 1,
                },
            };
        }

        return {
            type: 'fill',
            paint: {
                'fill-color': color,
                'fill-opacity': 0.8,
                'fill-outline-color': '#fff',
            },
        };
    }

    calculateIconLayerProps = (layer) => {
        const color = getPastelColorFromString(layer.layerName);
        const icons = layerTypes[layer.id].reduce((acc, type, index) => {
            acc[type] = `map-icon-${layer.id}-${index}`;
            return acc;
        }, {});
        const key = layerTypeKeys[layer.id];

        return {
            type: 'symbol',
            layout: {
                'icon-image': getSimpleCategoricalPaint(key, icons),
            },
            paint: {
            },
        };
    }

    renderSource = (layer) => {
        const { map, setContext } = this.props;
        const sourceKey = `map-layer-${layer.id}`;

        return (
            <GenericSource
                key={sourceKey}
                map={map}
                setContext={setContext}
                url={layer.file}
                sourceKey={sourceKey}
            />
        );
    }

    renderLayerIcons = (layer) => {
        const { map, context } = this.props;
        const sourceKey = `map-layer-${layer.id}`;
        const layerKey = `${sourceKey}-layer-icons`;

        if (!context[sourceKey] || !layerTypes[layer.id]) {
            return null;
        }

        return (
            <MapLayer
                key={layerKey}
                sourceKey={sourceKey}
                layerKey={layerKey}
                map={map}
                {...this.calculateIconLayerProps(layer)}
            />
        );
    }

    renderLayer = (layer) => {
        const { map, context } = this.props;
        const sourceKey = `map-layer-${layer.id}`;
        const layerKey = `${sourceKey}-layer`;

        if (!context[sourceKey]) {
            return null;
        }

        return (
            <MapLayer
                key={layerKey}
                sourceKey={sourceKey}
                layerKey={layerKey}
                map={map}
                {...this.calculateProps(layer)}
            />
        );
    }

    render() {
        const { selectedMapLayers, context } = this.props;

        if (!context.province || !context.municipality) {
            return null;
        }

        return (
            <React.Fragment>
                {selectedMapLayers.map(this.renderLayer)}
                {selectedMapLayers.map(this.renderLayerIcons)}
                {selectedMapLayers.map(this.renderSource)}
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(Layers);
