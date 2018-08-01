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
import iconNames from '../../../constants/iconNames';

import PrimaryButton from '../../../vendor/react-store/components/Action/Button';
import { getCategoricalPaint } from './utils';
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

        this.textPaint = {
            'icon-opacity': 0.75,
            'text-color': '#2a2a2a',
        };

        this.calculateTextLayout(props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.municipalities !== nextProps.municipalities ||
            this.props.textMarkers !== nextProps.textMarkers ||
            this.props.showTextMarkers !== nextProps.showTextMarkers
        ) {
            this.calculateTextLayout(nextProps);
        }
    }

    calculateTextMarkersText = (municipality, textMarkers) => {
        if (textMarkers === 'programs') {
            return municipality.totalNoOfProgrammes;
        }

        // const partners = (municipality.programs || []).reduce((acc, p) => (
        //     [...acc, ...p.partners.map(pt => pt.name)]
        // ), []);
        // return new Set(partners).size;
        return municipality.totalNoOfPartners;
    }

    calculateTextLayout = ({ municipalities, textMarkers, showTextMarkers }) => {
        const layout = {};

        if (municipalities.length <= 0) {
            this.textLayout = {};
            return;
        }

        if (!showTextMarkers) {
            this.textLayout = {
                'text-size': 0,
                'icon-size': 0,
            };
            return;
        }

        municipalities.forEach((municipality) => {
            const number = this.calculateTextMarkersText(municipality, textMarkers);
            layout[municipality.hlcitCode] = {
                textField: String(number || ''),
                iconImage: number ? 'circle' : '',
            };
        });

        this.textLayout = {
            'text-field': getCategoricalPaint('HLCIT_CODE', layout, 'textField'),
            'text-size': {
                stops: [[7.199, 0], [7.2, 11]],
            },
            'icon-image': getCategoricalPaint('HLCIT_CODE', layout, 'iconImage'),
            'icon-size': {
                stops: [[7.199, 0], [7.2, 0.02]],
            },
        };
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
            <div>
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
                    <div className={styles.info}>
                        Click on
                        <span className={iconNames.informationCircle} />
                        to open information pane for more details.

                    </div>
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
            <React.Fragment>
                <MapLayer
                    sourceKey="municipality-hover"
                    layerKey="municipality-hover"
                    property="HLCIT_CODE"
                    map={map}
                    type="fill"
                    paint={this.paint}
                    hoverInfo={this.hoverInfo}
                    filter={filter}
                    onClick={this.handleClick}
                />
                <MapLayer
                    map={map}
                    sourceKey="municipality"
                    layerKey="municipality-text"
                    type="symbol"
                    layout={this.textLayout}
                    paint={this.textPaint}
                />
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Municipality);
