import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';
import { RestRequest } from '../../vendor/react-store/utils/rest';

import {
    createUrlForProvinceGeoJson,
    urlForCountryGeoJson,
    urlForMunicipalitiesGeoJson,
    urlForIpssjGeoJson,
} from '../../rest';
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
    DashboardFilterParams,
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
import { GeoJSON } from '../../components/Map/MapLayer';

import FilterPane from './FilterPane';
import InformationPane from './InformationPane';
import RequestManager from './RequestManager';

import MapLayerGeoJsonGetRequest from './requests/MapLayerGeoJsonGetRequest';

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

const sameArraysIgnoreOrder = (a: any[], b: any[]) => {
    if (a.length !== b.length) {
        return;
    }

    for (let i = 0; i < a.length; i += 1) {
        const e1 = a[i];
        if (b.find((e2: any) => e1 !== e2)) {
            return false;
        }
    }

    return true;
};

export class Dashboard extends React.PureComponent<Props, State>{
    mapLayerGeoJsonRequests: Dictionary<RestRequest>;
    layersInfo: Dictionary<LayerInfo>;
    pendingGeoJsonRequests: number;

    constructor(props: Props) {
        super(props);

        this.state = {
            layersInfo: {},
        };
        this.pendingGeoJsonRequests = 0;

        this.layersInfo = {};
        this.mapLayerGeoJsonRequests = {};
    }

    componentDidMount() {
        this.reloadProvince();
        this.reloadMunicipalities();
        this.reloadMapLayer();
        this.reloadProgramLayer();
    }

    componentWillUnmount() {
        Object.values(this.mapLayerGeoJsonRequests).forEach(
            r => r.stop(),
        );
    }

    startRequestForMapLayerGeoJson = (
        key: string,
        url: string,
        responseHandler: (geoJson: GeoJSON) => void,
    ) => {
        if (this.mapLayerGeoJsonRequests[key]) {
            this.mapLayerGeoJsonRequests[key].stop();
        }

        const mapLayerGeoJsonRequest = new MapLayerGeoJsonGetRequest({
            setMapLayerGeoJson: responseHandler,
            setGeoJsons: this.props.setGeoJsons,
            preLoad: () => {
                this.pendingGeoJsonRequests += 1;
                this.props.setDashboardLoadings({
                    loadingGeoJson: this.pendingGeoJsonRequests > 0,
                });
            },
            postLoad: () => {
                this.pendingGeoJsonRequests -= 1;
                this.props.setDashboardLoadings({
                    loadingGeoJson: this.pendingGeoJsonRequests > 0,
                });
            },
        });

        this.mapLayerGeoJsonRequests[key] = mapLayerGeoJsonRequest.create({ url });
        this.mapLayerGeoJsonRequests[key].start();
    }

    setLayersInfo = (layersInfo: Dictionary<LayerInfo>) => {
        this.layersInfo = layersInfo;
        this.setState({ layersInfo });
    }

    handleFilterChange = (oldValues: DashboardFilterParams, values: DashboardFilterParams) => {
        const {
            provincesId = [],
            programmesId = [],
            sectorsId = [],
            mapLayersId = [],
        } = values;
        const {
            provincesId: oldProvincesId = [],
            programmesId: oldProgrammesId = [],
            sectorsId: oldSectorsId = [],
            mapLayersId: oldMapLayersId = [],
        } = oldValues;

        if (!sameArraysIgnoreOrder(oldProvincesId, provincesId)) {
            this.handleProvinceChange(provincesId);
        }
        if (!sameArraysIgnoreOrder(oldProgrammesId, programmesId)) {
            this.handleProgramChange(programmesId);
        }
        if (!sameArraysIgnoreOrder(oldSectorsId, sectorsId)) {
            // window.location.hash = '#/sector';
        }
        if (!sameArraysIgnoreOrder(oldMapLayersId, mapLayersId)) {
            this.handleMapLayerChange(mapLayersId);
        }
    }

    handleProvinceChange = (keys?: number[]) => {
        if (keys && keys.length) {
            // window.location.hash = '#/province';
        }
        this.reloadProvince();
        this.reloadMunicipalities();
    }

    handleMapLayerChange = (layerId?: number[]) => {
        this.reloadMapLayer();
    }

    handleProgramChange = (programmeId?: number[]) => {
        if (programmeId) {
            // window.location.hash = '#/programme';
        }
        this.reloadProgramLayer();
    }

    reloadSelectionToLayers = ({
        keyPrefix, selectedList, visibilityKey,
        color, typeOverride, urlOverride, orderOverride,
    } : {
        keyPrefix: string,
        selectedList: any[],
        visibilityKey?: string,
        color?: string,
        typeOverride?: string,
        urlOverride?: string,
        orderOverride?: number,
    }) => {
        const layersInfo = { ...this.layersInfo };

        Object.keys(layersInfo).filter((key: string) => key.startsWith(`${keyPrefix}-`))
            .forEach((key: string) => {
                delete layersInfo[key];
            });

        selectedList.forEach((selectedMapLayer) => {
            const key = `${keyPrefix}-${selectedMapLayer.id}`;
            const url = urlOverride || selectedMapLayer.file;
            const order = orderOverride || selectedMapLayer.order;
            let type = typeOverride || selectedMapLayer.type;

            if (type === 'Polygon') {
                type = 'Fill';
            }

            const layerInfo = {
                ...selectedMapLayer,
                type,
                color,
                visibilityKey,
                order,
                layerKey: key,
            };

            if (this.props.geoJsons[url]) {
                layersInfo[key] = {
                    ...layerInfo,
                    geoJson: this.props.geoJsons[url],
                };
            } else {
                this.startRequestForMapLayerGeoJson(key, url,  (geoJson: GeoJSON) => {
                    const layersInfo = { ...this.layersInfo };
                    layersInfo[key] = {
                        ...layerInfo,
                        geoJson,
                    };
                    this.setLayersInfo(layersInfo);
                });
            }
        });
        this.setLayersInfo(layersInfo);
    }

    reloadProvince = () => {
        const { selectedProvinces } = this.props;
        let selections: any[] = [];

        if (!selectedProvinces.length) {
            selections.push({
                id: 'country',
                file: urlForCountryGeoJson,
                type: 'Fill',
                order: 1,
                zoomOnLoad: true,
                handleHover: true,
                showPopUp: true,
                idKey: 'Province',
                labelKey: 'Province',
                onClick: this.handleMapClick,
                separateStroke: true,
            });
        } else {
            selections = [
                ...selectedProvinces.map(selectedProvince => ({
                    id: selectedProvince.id,
                    file: createUrlForProvinceGeoJson(selectedProvince.id),
                    type: 'Fill',
                    order: 1,
                    handleHover: true,
                    showPopUp: true,
                    idKey: 'FIRST_DCOD',
                    labelKey: 'FIRST_DIST',
                    separateStroke: true,
                    zoomOnLoad: selectedProvinces.length === 1,
                })),
            ];
        }

        this.reloadSelectionToLayers({
            keyPrefix: 'province',
            selectedList: selections,
        });
    }

    reloadMunicipalities = () => {
        const { selectedProvinces } = this.props;
        const selections: any[] = [];

        if (!selectedProvinces.length) {
            selections.push({
                id: 'municipalities',
                file: urlForMunicipalitiesGeoJson,
                type: 'Line',
                order: 2,
                opacity: 0.2,
            });
        }

        this.reloadSelectionToLayers({
            keyPrefix: 'municipality',
            selectedList: selections,
        });
    }

    reloadProgramLayer = () => {
        const { selectedProgrammes } = this.props;
        const ipss = selectedProgrammes.find(p => (
            p.name === 'Integrated Programme for Strengthening Security and Justice'
        ));
        const selectedList = [];
        if (ipss) {
            selectedList.push(ipss);
        }

        this.reloadSelectionToLayers({
            selectedList,
            keyPrefix: 'programmeLayer',
            visibilityKey: 'ActLevel',
            typeOverride: 'Fill',
            color: '#2ecc71',
            urlOverride: urlForIpssjGeoJson,
            orderOverride: 3,
        });
    }

    reloadMapLayer = () => {
        this.reloadSelectionToLayers({
            keyPrefix: 'mapLayer',
            selectedList: this.props.selectedMapLayers,
            color: '#e74c3c',
            orderOverride: 4,
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
            loadingGeoJson,
        } = this.props.requestManagerLoadings;

        const loading = (
            loadingProvinceData || loadingProgrammeData || loadingGeoJson ||
            loadingProvinces || loadingProgrammes || loadingSectors ||
            loadingIndicators || loadingSectorData || loadingCountryData
        );


        return (
            <div className={styles.dashboard}>
                <RequestManager />
                <FilterPane
                    className={styles.left}
                    disabled={loading}
                    onChange={this.handleFilterChange}
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
