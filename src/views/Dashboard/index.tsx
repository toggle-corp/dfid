import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';
import update from '../../vendor/react-store/utils/immutable-update';
import { getRgbFromHex } from '../../vendor/react-store/utils/common';
import mapStyles from '../../constants/mapStyles';

import {
    setCountriesDataAction,
    toggleDashboardProvinceAction,
    setProvincesAction,
    setProvincesDataAction,
    setProgrammesAction,
    setProgrammesDataAction,
    setSectorsAction,
    setIndicatorsAction,
    setMapLayersAction,
    setGeoJsonsAction,
    dashboardProvincesSelector,
    dashboardProgrammesSelector,
    dashboardSectorsSelector,
    dashboardMapLayersSelector,
    dashboardIndicatorSelector,
    dashboardRequestManagerLoadingSelector,
    municipalitiesSelector,
    geoJsonsSelector,
    setRequestManagerLoadingAction,
} from '../../redux';

import {
    DashboardRequestManagerLoadings,
    Dictionary,
    GeoJSONS,
    MapLayer,
    IndicatorData,
    MapLayerProps,
    Municipality,
    MunicipalityProgramme,
    Programme,
    Province,
    RootState,
    Sector,
    SetCountriesDataAction,
    SetGeoJsonsAction,
    SetIndicatorsAction,
    SetMapLayersAction,
    SetProgrammesAction,
    SetProgrammesDataAction,
    SetProvincesAction,
    SetProvincesDataAction,
    SetSectorsAction,
    SetRequestManagerLoadingAction,
} from '../../redux/interface';

import Map from '../../components/Map';
import ScaleLegend from '../../components/Map/ScaleLegend';

import FilterPane from './FilterPane';
import InformationPane from './InformationPane';
import RequestManager from './RequestManager';

import styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    selectedProvinces: Province[];
    selectedProgrammes: Programme[];
    selectedSectors: Sector[];
    selectedMapLayers: MapLayer[];
    selectedIndicator?: IndicatorData;
    municipalities: Municipality[];
    requestManagerLoadings: DashboardRequestManagerLoadings;
    geoJsons: GeoJSONS;
}
interface PropsFromDispatch {
    setCountriesData(params: SetCountriesDataAction): void;
    setProvinces(params: SetProvincesAction): void;
    setProvincesData(params: SetProvincesDataAction): void;
    setProgrammes(params: SetProgrammesAction): void;
    setProgrammesData(params: SetProgrammesDataAction): void;
    setSectors(params: SetSectorsAction): void;
    setIndicators(params: SetIndicatorsAction): void;
    setMapLayers(params: SetMapLayersAction): void;
    toggleDashboardProvince(provinceId: number): void;
    setGeoJsons: (params: SetGeoJsonsAction) => void;
    setDashboardLoadings(params: SetRequestManagerLoadingAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch & RouteComponentProps<{}>;

interface State {
    layersInfo: Dictionary<MapLayerProps>;
}

const emptyList: any[] = [];

export class Dashboard extends React.PureComponent<Props, State>{

    constructor(props: Props) {
        super(props);

        this.state = {
            layersInfo: {},
        };
    }

    setLayersInfo = (settings: object) => {
        this.setState((state: State) => {
            const wrappedSettings = {
                layersInfo: settings,
            };
            return update(state, wrappedSettings);
        });
    }

    handleProvinceClick = (key: string) => {
        const { toggleDashboardProvince } = this.props;
        toggleDashboardProvince(parseInt(key, 10));
    }

    handleMunicipalityClick = (key: string, name: string) => {
        // TODO: Select municipality
        console.warn(key, name);
    }

    renderIndicatorLegend = () => {
        const { selectedIndicator } = this.props;
        if (!selectedIndicator) {
            return null;
        }

        const { minValue, maxValue } = selectedIndicator;

        const calcOpacity = (value: number) => {
            const fraction = (value - minValue) / (maxValue - minValue);
            const offset = 0.25;
            return fraction * (0.85 - offset) + offset;
        };

        const { r, g, b } = getRgbFromHex(mapStyles.indicator.color);
        const minColor = `rgba(${r}, ${g}, ${b}, ${calcOpacity(minValue)})`;
        const maxColor = `rgba(${r}, ${g}, ${b}, ${calcOpacity(maxValue)})`;

        return (
            <ScaleLegend
                className={styles.scaleLegend}
                minValue={String(minValue)}
                maxValue={String(maxValue)}
                minColor={minColor}
                maxColor={maxColor}
                title="Indicator"
                subTitle={selectedIndicator.name}
            />
        );
    }

    renderProgramLegend = () => {
        const { selectedProgrammes, municipalities } = this.props;
        if (selectedProgrammes.length === 0) {
            return null;
        }

        const selectedProgrammeIds = selectedProgrammes.map(p => p.id);
        const budgets = {};
        municipalities.forEach((municipality) => {
            budgets[municipality.hlcitCode] = (municipality.programs || emptyList).filter(
                (p: MunicipalityProgramme) => selectedProgrammeIds.indexOf(p.programId) >= 0,
            ).map(p => p.programBudget).reduce((acc, b) => acc + b, 0);
        });

        const budgetList: number[] = Object.values(budgets);
        const minValue = Math.min(...budgetList);
        const maxValue = Math.max(...budgetList);

        const calcOpacity = (value: number) => {
            const fraction = (value - minValue) / (maxValue - minValue);
            const offset = 0.25;
            return fraction * (0.85 - offset) + offset;
        };

        const { r, g, b } = getRgbFromHex(mapStyles.indicator.color);
        const minColor = `rgba(${r}, ${g}, ${b}, ${calcOpacity(minValue)})`;
        const maxColor = `rgba(${r}, ${g}, ${b}, ${calcOpacity(maxValue)})`;

        console.warn(minColor, maxColor);

        return (
            <ScaleLegend
                className={styles.scaleLegend}
                minValue={String(minValue)}
                maxValue={String(maxValue)}
                minColor={minColor}
                maxColor={maxColor}
                title="Total budget (for selected programmes)"
            />
        );
    }

    renderMapChildren = () => (
        <React.Fragment>
            {this.renderIndicatorLegend()}
            {this.renderProgramLegend()}
        </React.Fragment>
    )

    render() {
        const { layersInfo } = this.state;
        const {
            loadingMunicipalities,
            loadingCountryData,
            loadingProvinceData,
            loadingProgrammeData,
            loadingSectorData,
            loadingProvinces,
            loadingProgrammes,
            loadingSectors,
            loadingIndicators,
            loadingIndicatorsData,
            loadingGeoJson,
            loadingLayers,
        } = this.props.requestManagerLoadings;

        const loading = (
            loadingProvinces || loadingProvinceData ||
            loadingProgrammes || loadingProgrammeData ||
            loadingSectors || loadingSectorData ||
            loadingIndicators || loadingIndicatorsData ||
            loadingGeoJson || loadingCountryData ||
            loadingLayers || loadingMunicipalities
        );

        return (
            <div className={styles.dashboard}>
                <RequestManager
                    handleProvinceClick={this.handleProvinceClick}
                    handleMunicipalityClick={this.handleMunicipalityClick}
                    layersInfo={layersInfo}
                    setLayersInfo={this.setLayersInfo}
                    loading={!!loading}
                />
                <FilterPane
                    className={styles.left}
                    disabled={loading}
                    loadingProvinces={loadingProvinces}
                    loadingProgrammes={loadingProgrammes}
                    loadingSectors={loadingSectors}
                    loadingIndicators={loadingIndicators}
                    loadingLayers={loadingLayers}
                />
                <div className={styles.right}>
                    {loadingGeoJson && <LoadingAnimation />}
                    <Map
                        className={styles.map}
                        layers={layersInfo}
                        hideLayers={loadingGeoJson}
                    >
                        {this.renderMapChildren()}
                    </Map>
                    <InformationPane
                        className={styles.informationPane}
                        loadingProvinceData={loadingProvinceData}
                        loadingProgrammeData={loadingProgrammeData}
                        loadingSectorData={loadingSectorData}
                        loadingCountryData={loadingCountryData}
                        loadingMunicipalities={loadingMunicipalities}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    selectedProvinces: dashboardProvincesSelector(state),
    selectedProgrammes: dashboardProgrammesSelector(state),
    selectedSectors: dashboardSectorsSelector(state),
    selectedMapLayers: dashboardMapLayersSelector(state),
    selectedIndicator: dashboardIndicatorSelector(state),
    municipalities: municipalitiesSelector(state),
    requestManagerLoadings: dashboardRequestManagerLoadingSelector(state),
    geoJsons: geoJsonsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setCountriesData: (params: SetCountriesDataAction) => dispatch(setCountriesDataAction(params)),
    setProvinces: (params: SetProvincesAction) => dispatch(setProvincesAction(params)),
    toggleDashboardProvince: (provinceId: number) =>
        dispatch(toggleDashboardProvinceAction(provinceId)),
    setProvincesData: (params: SetProvincesDataAction) => dispatch(setProvincesDataAction(params)),
    setProgrammes: (params: SetProgrammesAction) => dispatch(setProgrammesAction(params)),
    setProgrammesData: (params: SetProgrammesDataAction) =>
        dispatch(setProgrammesDataAction(params)),
    setSectors: (params: SetSectorsAction) => dispatch(setSectorsAction(params)),
    setIndicators: (params: SetIndicatorsAction) => dispatch(setIndicatorsAction(params)),
    setMapLayers: (params: SetMapLayersAction) => dispatch(setMapLayersAction(params)),
    setGeoJsons: (params: SetGeoJsonsAction) => dispatch(setGeoJsonsAction(params)),
    setDashboardLoadings: (params: SetRequestManagerLoadingAction) =>
        dispatch(setRequestManagerLoadingAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Dashboard);
