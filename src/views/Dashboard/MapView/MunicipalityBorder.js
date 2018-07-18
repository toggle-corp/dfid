import React from 'react';
import { connect } from 'react-redux';

import {
    dashboardMunicipalitiesSelector,
} from '../../../redux';

import MapLayer from '../../../components/Map/MapLayer';
import mapStyles from '../../../constants/mapStyles';
import { getCategoricalPaint } from './utils';

const mapStateToProps = state => ({
    selectedMunicipalities: dashboardMunicipalitiesSelector(state),
});


class Municipality extends React.PureComponent {
    paint = {
        'line-color': mapStyles.municipalities.stroke,
        'line-width': mapStyles.municipalities.strokeWidth,
        'line-opacity': mapStyles.municipalities.strokeOpacity,
    }

    selectionPaint = {
        'line-color': mapStyles.municipalities.selectedStroke,
        'line-width': mapStyles.municipalities.selectedStrokeWidth,
        'line-opacity': mapStyles.municipalities.selectedStrokeOpacity,
    }

    render() {
        const {
            map,
            context,
            selectedMunicipalities,
        } = this.props;

        if (!context.municipality || !context.province) {
            return null;
        }

        const municipalityIds = selectedMunicipalities.map(p => p.hlcitCode);
        const selectionFilter = ['in', 'HLCIT_CODE', ...municipalityIds];

        return (
            <React.Fragment>
                <MapLayer
                    sourceKey="municipality"
                    layerKey="municipality-border"
                    map={map}
                    type="line"
                    paint={this.paint}
                />
                <MapLayer
                    sourceKey="municipality"
                    layerKey="municipality-border-selection"
                    map={map}
                    type="line"
                    paint={this.selectionPaint}
                    filter={selectionFilter}
                />
            </React.Fragment>
        );
    }
}
export default connect(mapStateToProps)(Municipality);
