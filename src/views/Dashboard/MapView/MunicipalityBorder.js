import React from 'react';
import { connect } from 'react-redux';

import {
    municipalitiesSelector,
    dashboardMunicipalitiesSelector,
} from '../../../redux';

import MapLayer from '../../../components/Map/MapLayer';
import mapStyles from '../../../constants/mapStyles';
import { getCategoricalPaint } from './utils';

const mapStateToProps = state => ({
    municipalities: municipalitiesSelector(state),
    selectedMunicipalities: dashboardMunicipalitiesSelector(state),
});


class Municipality extends React.PureComponent {
    componentWillMount() {
        this.calculatePaint(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.selectedMunicipalities !== nextProps.selectedMunicipalities) {
            this.calculatePaint(nextProps);
        }
    }

    calculatePaint = ({ municipalities, selectedMunicipalities }) => {
        const style = {};
        municipalities.forEach((municipality) => {
            style[municipality.hlcitCode] = {
                color: mapStyles.municipalities.stroke,
                strokeWidth: mapStyles.municipalities.strokeWidth,
                strokeOpacity: mapStyles.municipalities.strokeOpacity,
            };
        });

        selectedMunicipalities.forEach((municipality) => {
            style[municipality.hlcitCode] = {
                color: mapStyles.municipalities.selectedStroke,
                strokeWidth: mapStyles.municipalities.selectedStrokeWidth,
                strokeOpacity: mapStyles.municipalities.selectedStrokeOpacity,
            };
        });

        this.paint = {
            'line-color': getCategoricalPaint('HLCIT_CODE', style, 'color'),
            'line-width': getCategoricalPaint('HLCIT_CODE', style, 'strokeWidth'),
            'line-opacity': getCategoricalPaint('HLCIT_CODE', style, 'strokeOpacity'),
        };
    }

    render() {
        const {
            map,
            context,
        } = this.props;

        if (!context.municipality) {
            return null;
        }

        return (
            <MapLayer
                sourceKey="municipality"
                layerKey="municipality-border"
                map={map}
                type="line"
                paint={this.paint}
            />
        );
    }
}
export default connect(mapStateToProps)(Municipality);
