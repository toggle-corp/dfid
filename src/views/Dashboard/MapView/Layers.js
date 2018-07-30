import React from 'react';
import { connect } from 'react-redux';

import { dashboardMapLayersSelector } from '../../../redux';

import { getHexFromString } from '../../../vendor/react-store/utils/common';
import MapLayer from '../../../components/Map/MapLayer';
import GenericSource from './GenericSource';
import { getSimpleCategoricalPaint } from './utils';

export const healthFacilitiesIcons = {
    'PHCC': '✚',
    'Government hospital': 'G',
    'SHP': '★',
    'HP': 'U',
    'Other HFs': 'X',
    'Radiology/lab': 'R',
    'Private clinics': 'C',
    'Private hospital': 'P',
    'Non-government hospital': 'O',
    'Nursing home': 'N',
    'Hospital': 'H',
};


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

    calculateHFProps = (layer) => {
        const color = getHexFromString(layer.layerName);
        return {
            type: 'symbol',
            layout: {
                'icon-image': 'circle2',
                'text-field': getSimpleCategoricalPaint('MAJROTYP', healthFacilitiesIcons),
                'text-size': 11,
                'icon-size': 0.03,
                'icon-allow-overlap': true,
                'icon-ignore-placement': true,
                'icon-optional': true,
            },
            paint: {
                'text-color': '#FFF',
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

        if (layer.id === 26) {
            return (
                <MapLayer
                    key={layerKey}
                    sourceKey={sourceKey}
                    layerKey={layerKey}
                    map={map}
                    {...this.calculateHFProps(layer)}
                />
            );
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
                {selectedMapLayers.map(this.renderSource)}
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(Layers);
