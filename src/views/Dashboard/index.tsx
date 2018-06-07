import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';
import update from '../../vendor/react-store/utils/immutable-update';

import {
    setCountriesDataAction,
    setDashboardProvinceAction,
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
    dashboardRequestManagerLoadingSelector,
    geoJsonsSelector,
    setRequestManagerLoadingAction,
} from '../../redux';

import {
    DashboardRequestManagerLoadings,
    Dictionary,
    GeoJSONS,
    MapLayer,
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

import Map, { LayerInfo } from '../../components/Map';

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
    setDashboardProvince(provinceId: number): void;
    setGeoJsons: (params: SetGeoJsonsAction) => void;
    setDashboardLoadings(params: SetRequestManagerLoadingAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch & RouteComponentProps<{}>;

interface State {
    layersInfo: Dictionary<LayerInfo>;
}

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

    handleMapClick = (key: string) => {
        const { selectedProvinces, setDashboardProvince } = this.props;
        if (!(selectedProvinces && selectedProvinces.length)) {
            setDashboardProvince(parseInt(key, 10));
        }
    }

    render() {
        const { layersInfo } = this.state;
        const {
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
        } = this.props.requestManagerLoadings;

        const loading = (
            loadingProvinces || loadingProvinceData ||
            loadingProgrammes || loadingProgrammeData ||
            loadingSectors || loadingSectorData ||
            loadingIndicators || loadingIndicatorsData ||
            loadingGeoJson || loadingCountryData
        );


        return (
            <div className={styles.dashboard}>
                <RequestManager
                    handleMapClick={this.handleMapClick}
                    layersInfo={layersInfo}
                    setLayersInfo={this.setLayersInfo}
                    loading={!!loading}
                />
                <FilterPane
                    className={styles.left}
                    disabled={loading}
                />
                <div className={styles.right}>
                    {loadingGeoJson && <LoadingAnimation />}
                    <Map
                        className={styles.map}
                        layers={layersInfo}
                        hideLayers={loadingGeoJson}
                    />
                    <InformationPane
                        loadingProvinceData={loadingProvinceData}
                        loadingProgrammeData={loadingProgrammeData}
                        loadingSectorData={loadingSectorData}
                        loadingCountryData={loadingCountryData}
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
    requestManagerLoadings: dashboardRequestManagerLoadingSelector(state),
    geoJsons: geoJsonsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setCountriesData: (params: SetCountriesDataAction) => dispatch(setCountriesDataAction(params)),
    setProvinces: (params: SetProvincesAction) => dispatch(setProvincesAction(params)),
    setDashboardProvince: (provinceId: number) => dispatch(setDashboardProvinceAction(provinceId)),
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
