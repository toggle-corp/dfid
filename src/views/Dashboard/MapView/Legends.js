import React from 'react';
import { connect } from 'react-redux';

import {
    dashboardIndicatorSelector,
    dashboardMunicipalityIndicatorSelector,
    dashboardProgrammesSelector,
    dashboardMapLayersSelector,
    municipalityIndicatorsDataSelector,
    municipalitiesSelector,
} from '../../../redux';

import PrimaryButton from '../../../vendor/react-store/components/Action/Button/PrimaryButton';
import { getRgbFromHex } from '../../../vendor/react-store/utils/common';
import { getPastelColorFromString } from '../../../utils/common';
import { iconNames, defaultFilters } from '../../../constants';

import Legend from '../../../components/Map/Legend';
import ScaleLegend from '../../../components/Map/ScaleLegend';
import mapStyles from '../../../constants/mapStyles';
import styles from './styles.scss';

import {
    renderPound,
    renderNumeral,
    renderNormalNumeral,
} from '../../../components/Renderer';

import layerTypes, { layerTypeKeys, icons } from './layerTypes';

const emptyList = [];

const mapStateToProps = state => ({
    selectedIndicator: dashboardIndicatorSelector(state),
    selectedProgrammes: dashboardProgrammesSelector(state),
    selectedMapLayers: dashboardMapLayersSelector(state),
    selectedMunicipalityIndicator: dashboardMunicipalityIndicatorSelector(state),
    municipalities: municipalitiesSelector(state),
    municipalityIndicators: municipalityIndicatorsDataSelector(state),
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
                title="Province Indicator"
                subTitle={renderIndicatorSubTitle(name, unit)}
            />
        );
    }

    renderMunicipalityIndicatorLegend = () => {
        const { selectedMunicipalityIndicator, municipalityIndicators } = this.props;
        if (!selectedMunicipalityIndicator) {
            return null;
        }

        const indicator = defaultFilters.municipalityIndicators
            .find(i => i.key === selectedMunicipalityIndicator);
        const { label: name, unit } = indicator;

        const values = municipalityIndicators.map(i => i[selectedMunicipalityIndicator]);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);

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
                title="Municipality Indicator"
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
        const {
            selectedMapLayers,
            zoomLevel,
            textMarkers,
        } = this.props;

        if (selectedMapLayers.length === 0 && zoomLevel < 7.2) {
            return null;
        }

        let legendItems = selectedMapLayers.filter(l => !layerTypes[l.id]).map(l => ({
            label: l.layerName,
            color: getPastelColorFromString(l.layerName),
        }));

        selectedMapLayers.filter(l => layerTypes[l.id]).forEach((l) => {
            layerTypes[l.id].forEach((key, index) => {
                legendItems.push({
                    label: `${l.layerName} - ${key}`,
                    color: getPastelColorFromString(l.layerName),
                    size: 14,
                    innerText: (
                        <img src={icons[l.id][index]} width="8px" height="8px" />
                    ),
                });
            });
        });

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
            <div className={styles.panelsButton}>
                <PrimaryButton
                    iconName={iconNames.swapArrows}
                    onClick={this.props.onToggleTextMarkers}
                    title="Click to toggle between Partners and Programmes"
                    disabled={!this.props.showTextMarkers}
                    transparent
                />
                <PrimaryButton
                    iconName={this.props.showTextMarkers ? iconNames.eye : iconNames.eyeDisabled}
                    onClick={this.props.onToggleTextMarkersVisibility}
                    title="Click to show / hide"
                    transparent
                />
            </div>
        );
    }

    render() {
        return (
            <React.Fragment>
                {this.renderMapLayersLegend()}
                {this.renderIndicatorLegend()}
                {this.renderMunicipalityIndicatorLegend()}
                {this.renderProgramsLegend()}
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(Legends);
