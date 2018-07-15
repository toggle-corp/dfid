import React from 'react';
import { connect } from 'react-redux';

import {
    municipalitiesSelector,
    dashboardMunicipalitiesSelector,
} from '../../../redux';

import MapLayer from '../../../components/Map/MapLayer';
import { getCategoricalPaint } from './utils';

const mapStateToProps = state => ({
    municipalities: municipalitiesSelector(state),
    selectedMunicipalities: dashboardMunicipalitiesSelector(state),
});


class Municipality extends React.PureComponent {
    paint = {
        'line-color': '#fff',
    }

    componentDidMount() {
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
                color: '#000',
                strokeWidth: 1,
            };
        });

        selectedMunicipalities.forEach((municipality) => {
            style[municipality.hlcitCode] = {
                color: '#00f',
                strokeWidth: 2,
            };
        });

        this.paint = {
            'line-color': getCategoricalPaint('HLCIT_CODE', style, 'color'),
            'line-width': getCategoricalPaint('HLCIT_CODE', style, 'strokeWidth'),

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
