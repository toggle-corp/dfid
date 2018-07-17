import React from 'react';
import { connect } from 'react-redux';

import { dashboardMapLayersSelector } from '../../../redux';

import { getHexFromString } from '../../../vendor/react-store/utils/common';
import MapLayer from '../../../components/Map/MapLayer';
import GenericSource from './GenericSource';

const mapStateToProps = state => ({
    selectedMapLayers: dashboardMapLayersSelector(state),
});

class Layers extends React.PureComponent {
    calculateProps = (layer) => {
        const color = getHexFromString(layer.layerName);

        if (layer.type === 'Point') {
            return {
                type: 'circle',
                paint: {
                    'circle-color': color,
                    'circle-stroke-color': '#404040',
                    'circle-stroke-width': 1,
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
        const { selectedMapLayers } = this.props;

        return (
            <React.Fragment>
                {selectedMapLayers.map(this.renderLayer)}
                {selectedMapLayers.map(this.renderSource)}
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(Layers);
