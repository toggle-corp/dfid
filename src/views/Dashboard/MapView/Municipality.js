import React from 'react';
import { connect } from 'react-redux';

import {
    dashboardProgrammesSelector,
    municipalitiesSelector,
} from '../../../redux';

import MapLayer from '../../../components/Map/MapLayer';
import mapStyles from '../../../constants/mapStyles';

import { getCategoricalPaint } from './utils';
import styles from './styles.scss';

const emptyList = [];

const mapStateToProps = state => ({
    selectedProgrammes: dashboardProgrammesSelector(state),
    municipalities: municipalitiesSelector(state),
});

class Municipality extends React.PureComponent {
    componentWillMount() {
        this.calculatePaint(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.selectedProgrammes !== nextProps.selectedProgrammes) {
            this.calculatePaint(nextProps);
        }
    }

    calculatePaint = ({ selectedProgrammes, municipalities }) => {
        if (selectedProgrammes.length === 0) {
            this.paint = {
                'fill-color': '#fff',
                'fill-opacity': 0,
            }
            return;
        }

        const style = {};
        const selectedProgrammeIds = selectedProgrammes.map(p => p.id);

        const budgets = {};
        municipalities.forEach((municipality) => {
            budgets[municipality.hlcitCode] = (municipality.programs || emptyList)
                .filter(p => selectedProgrammeIds.indexOf(p.programId) >= 0)
                .map(p => p.programBudget)
                .reduce((acc, b) => acc + b, 0);
        });

        const budgetList = Object.values(budgets);
        const minValue = Math.min(...budgetList);
        const maxValue = Math.max(...budgetList);

        municipalities.forEach((municipality) => {
            const value = budgets[municipality.hlcitCode];
            const fraction = (value - minValue) / (maxValue - minValue);
            const offset = 0.25;
            const fractionWithOffset = fraction * (0.85 - offset) + offset;

            style[municipality.hlcitCode] = {
                color: mapStyles.provinces.color,
                opacity: fractionWithOffset,
            };
        });

        this.paint = {
            'fill-color': getCategoricalPaint('HLCIT_CODE', style, 'color'),
            'fill-opacity': getCategoricalPaint('HLCIT_CODE', style, 'opacity'),
        };
    }

    render() {
        const {
            map,
            context,
        } = this.props;

        if (!context.municipality || !context.province) {
            return null;
        }

        return (
            <MapLayer
                sourceKey="municipality"
                layerKey="municipality"
                property="HLCIT_CODE"
                map={map}
                type="fill"
                paint={this.paint}
            />
        );
    }
}

export default connect(mapStateToProps)(Municipality);
