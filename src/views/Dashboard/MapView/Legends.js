import React from 'react';
import { connect } from 'react-redux';

import {
    dashboardIndicatorSelector,
    dashboardProgrammesSelector,
    dashboardMapLayersSelector,
    municipalitiesSelector,
} from '../../../redux';

import PrimaryButton from '../../../vendor/react-store/components/Action/Button/PrimaryButton';
import { getRgbFromHex, getHexFromString } from '../../../vendor/react-store/utils/common';
import { iconNames } from '../../../vendor/react-store/constants';

import Legend from '../../../components/Map/Legend';
import ScaleLegend from '../../../components/Map/ScaleLegend';
import mapStyles from '../../../constants/mapStyles';
import styles from './styles.scss';

import {
    renderPound,
    renderNumeral,
    renderNormalNumeral,
} from '../../../components/Renderer';

const emptyList = [];

const mapStateToProps = state => ({
    selectedIndicator: dashboardIndicatorSelector(state),
    selectedProgrammes: dashboardProgrammesSelector(state),
    selectedMapLayers: dashboardMapLayersSelector(state),
    municipalities: municipalitiesSelector(state),
});

const renderIndicatorSubTitle = (name, unit) => {
    let symbol = unit;
    if (!unit || unit === '0' || unit.toLowerCase() === 'in number') {
        return name;
    }
    if (unit.toLowerCase() === 'in percent') {
        symbol = '%';
    }
    return `${name} (${symbol})`;
};

const renderIndicatorLabel = (value, unit) => {
    if (unit === '0') {
        return renderNumeral(value, 3);
    }
    return renderNormalNumeral(value);
};

class Legends extends React.PureComponent {
    renderIndicatorLegend = () => {
        const { selectedIndicator } = this.props;
        if (!selectedIndicator) {
            return null;
        }

        const { minValue, maxValue, unit, name } = selectedIndicator;

        const calcOpacity = (value) => {
            const fraction = (value - minValue) / (maxValue - minValue);
            const offset = 0.25;
            return fraction * (0.85 - offset) + offset;
        };

        const { r, g, b } = getRgbFromHex(mapStyles.provinces.indicatorColor);
        const minColor = `rgba(${r}, ${g}, ${b}, ${calcOpacity(minValue)})`;
        const maxColor = `rgba(${r}, ${g}, ${b}, ${calcOpacity(maxValue)})`;

        return (
            <ScaleLegend
                className={styles.scaleLegend}
                minValue={minValue}
                maxValue={maxValue}
                minLabel={renderIndicatorLabel(minValue, unit)}
                maxLabel={renderIndicatorLabel(maxValue, unit)}
                minColor={minColor}
                maxColor={maxColor}
                title="Indicator"
                subTitle={renderIndicatorSubTitle(name, unit)}
            />
        );
    }

    renderProgramsLegend = () => {
        const { selectedProgrammes, municipalities } = this.props;
        if (selectedProgrammes.length === 0) {
            return null;
        }

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

        const calcOpacity = (value) => {
            const fraction = (value - minValue) / (maxValue - minValue);
            const offset = 0.25;
            return fraction * (0.85 - offset) + offset;
        };

        const { r, g, b } = getRgbFromHex(mapStyles.provinces.color);
        const minColor = `rgba(${r}, ${g}, ${b}, ${calcOpacity(minValue)})`;
        const maxColor = `rgba(${r}, ${g}, ${b}, ${calcOpacity(maxValue)})`;

        return (
            <ScaleLegend
                className={styles.scaleLegend}
                minValue={minValue}
                maxValue={maxValue}
                minLabel={renderPound(minValue)}
                maxLabel={renderPound(maxValue)}
                minColor={minColor}
                maxColor={maxColor}
                title="Total budget (for selected programmes)"
            />
        );
    }

    renderMapLayersLegend = () => {
        const { selectedMapLayers, zoomLevel, textMarkers } = this.props;
        if (selectedMapLayers.length === 0 && zoomLevel < 7.2) {
            return null;
        }

        let legendItems = selectedMapLayers.map(l => ({
            label: l.layerName,
            color: getHexFromString(l.layerName),
        }));

        if (zoomLevel >= 7.2) {
            legendItems.push({
                label: `Number of ${textMarkers}`,
                color: '#ffc000',
                innerText: '#',
                size: 14,
                rightComponent: this.renderToggleTextMarkersButton,
            });
        }

        return (
            <Legend
                className={styles.legend}
                legendItems={legendItems}
            />
        );
    }

    renderToggleTextMarkersButton = () => {
        return (
            <PrimaryButton
                iconName={iconNames.panels}
                onClick={this.props.onToggleTextMarkers}
                transparent
            />
        );
    }

    render() {
        return (
            <React.Fragment>
                {this.renderMapLayersLegend()}
                {this.renderIndicatorLegend()}
                {this.renderProgramsLegend()}
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(Legends);
