import React from 'react';
import { connect } from 'react-redux';

import {
    toggleDashboardMunicipilityAction,
    dashboardProvincesSelector,
    municipalitiesSelector,
} from '../../../redux';

import List from '../../../vendor/react-store/components/View/List';
import {
    renderPound,
    renderNumeral,
} from '../../../components/Renderer';

import MapLayer from '../../../components/Map/MapLayer';
import mapStyles from '../../../constants/mapStyles';
import styles from './styles.scss';

const mapStateToProps = state => ({
    selectedProvinces: dashboardProvincesSelector(state),
    municipalities: municipalitiesSelector(state),
});

const mapDispatchToProps = dispatch => ({
    toggleSelectedMunicipality: (provinceId) =>
        dispatch(toggleDashboardMunicipilityAction(provinceId)),
});

class Municipality extends React.PureComponent {
    static programKeyExtractor = p => p.program;

    constructor(props) {
        super(props);

        this.paint = {
            'fill-color': '#fff',
            'fill-opacity': 0,
        }

        this.hoverInfo = {
            paint: {
                'fill-color': mapStyles.municipalities.hoverColor,
                'fill-opacity': mapStyles.municipalities.hoverOpacity,
            },
            showTooltip: true,
            tooltipModifier: this.renderTooltip,
        }
    }

    handleClick = (key) => {
        const { municipalities } = this.props;
        const municipality = municipalities.find(municipality => municipality.hlcitCode === key);
        if (municipality) {
            this.props.toggleSelectedMunicipality(municipality.id);
        }
    }

    renderMunicipalityProgram = (key, datum) => {
        return (
            <div key={key} className={styles.program}>
                <span>{datum.program}</span>
                <span className={styles.number}>{renderPound(datum.programBudget)}</span>
                <span className={styles.number}>{renderNumeral(datum.totalNoOfPartners, 0)}</span>
            </div>
        );
    }

    renderMunicipalityProgramList = (municipality) => {
        if (!municipality || !municipality.programs || municipality.programs.length === 0) {
            return (
                <div className={styles.empty}>
                    No information available
                </div>
            );
        }

        return (
            <div className={styles.programs}>
                <div className={styles.header}>
                    <span>Program</span>
                    <span>Budget</span>
                    <span>Partners</span>
                </div>
                <List
                    data={municipality.programs}
                    keyExtractor={Municipality.programKeyExtractor}
                    modifier={this.renderMunicipalityProgram}
                />
            </div>
        );
    }

    renderTooltip = (properties) => {
        const { municipalities } = this.props;
        const label = properties.LU_Name;
        const municipality = municipalities.find(m => m.hlcitCode === properties.HLCIT_CODE);

        return (
            <div className={styles.municipalityTooltip}>
                <h4 className={styles.title}>
                    {label}
                </h4>
                {this.renderMunicipalityProgramList(municipality)}
            </div>
        );
    }

    render() {
        const {
            map,
            context,
            selectedProvinces,
        } = this.props;

        if (!context.municipality || !context.province) {
            return null;
        }

        const provinceIds = selectedProvinces.map(p => String(p.id));
        const filter = ['in', 'STATE', ...provinceIds];

        return (
            <MapLayer
                sourceKey="municipality"
                layerKey="municipality"
                property="HLCIT_CODE"
                map={map}
                type="fill"
                paint={this.paint}
                hoverInfo={this.hoverInfo}
                filter={filter}
                onClick={this.handleClick}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Municipality);
