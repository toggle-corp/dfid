import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';
import FixedTabs from '../../vendor/react-store/components/View/FixedTabs';
import MultiViewContainer from '../../vendor/react-store/components/View/MultiViewContainer';
import { RestRequest } from '../../vendor/react-store/utils/rest';

import {
    createUrlForProvinceGeoJson,
    urlForCountryGeoJson,
    urlForMunicipalitiesGeoJson,
    urlForIpssjGeoJson,
} from '../../rest';
import {
    setDashboardProvinceAction,
    setProvincesAction,
    setProvincesDataAction,
    setProgrammesAction,
    setProgrammesDataAction,
    setSectorsAction,
    setIndicatorsAction,
    setMapLayersAction,
    dashboardProvincesSelector,
    dashboardProgrammesSelector,
    dashboardSectorsSelector,
    dashboardMapLayersSelector,
} from '../../redux';

import {
    RootState,
    Province,
    Programme,
    Sector,
    SetProvincesAction,
    SetProvincesDataAction,
    SetProgrammesAction,
    SetProgrammesDataAction,
    SetSectorsAction,
    SetIndicatorsAction,
    SetMapLayersAction,
    DashboardFilterParams,
    MapLayer,
} from '../../redux/interface';

import Map from '../../components/Map';

import GeoJsonLayer, { GeoJSON } from '../../components/Map/MapLayer';

import CountryDetails from '../Dashboard/CountryDetails';
import Filter from './Filter';
import MultiProvinceDetailInfo from './MultiProvinceDetailInfo';
import MultiProgrammeDetailInfo from '../Dashboard/MultiProgrammeDetailInfo';
import MultiSectorDetailInfo from '../Dashboard/MultiSectorDetailInfo';

import ProvinceDataGetRequest from './requests/ProvinceDataGetRequest';
import ProvincesGetRequest from './requests/ProvincesGetRequest';
import ProgrammesGetRequest from './requests/ProgrammesGetRequest';
import SectorsGetRequest from './requests/SectorsGetRequest';
import ProgrammesDataGetRequest from './requests/ProgrammesDataGetRequest';
import MapLayerGeoJsonGetRequest from './requests/MapLayerGeoJsonGetRequest';
import IndicatorsGetRequest from './requests/IndicatorsGetRequest';
import MapLayersGetRequest from './requests/MapLayersGetRequest';

import styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    selectedProvinces: Province[];
    selectedProgrammes: Programme[];
    selectedSectors: Sector[];
    selectedMapLayers: MapLayer[];
}
interface PropsFromDispatch {
    setProvinces(params: SetProvincesAction): void;
    setProvincesData(params: SetProvincesDataAction): void;
    setProgrammes(params: SetProgrammesAction): void;
    setProgrammesData(params: SetProgrammesDataAction): void;
    setSectors(params: SetSectorsAction): void;
    setIndicators(params: SetIndicatorsAction): void;
    setMapLayers(params: SetMapLayersAction): void;
    setDashboardProvince(provinceId: number): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch & RouteComponentProps<{}>;

type Dictionary<T> = {
    [key: string]: T;
};

interface LayerInfo {
    layerKey: string;
    order: number;
    geoJson: GeoJSON;
    type: string;
    separateStroke?: boolean;
    color?: string;
    opacity?: number;
    visibilityKey?: string;
    idKey?: string;
    labelKey?: string;
    zoomOnLoad?: boolean;
    handleHover?: boolean;
    showPopUp?: boolean;
    onClick?(key: String): void;
}

interface State {
    loadingProvinceData: boolean;
    loadingProgrammeData: boolean;
    loadingSectorData: boolean;
    loadingProvinces: boolean;
    loadingProgrammes: boolean;
    loadingSectors: boolean;
    loadingIndicators: boolean;
    layersInfo: Dictionary<LayerInfo>;
    loadingGeoJson: boolean;
}

interface Routes {
    province: string;
    programme: string;
    sector: string;
}

interface Views {
    province: object;
    programme: object;
    sector: object;
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
    provinceDataRequest: RestRequest;
    provincesRequest: RestRequest;
    programmeRequest: RestRequest;
    sectorRequest: RestRequest;
    indicatorsRequest: RestRequest;
    mapLayersRequest: RestRequest;
    programmeDataRequest: RestRequest;
    geoJsonRequest: RestRequest;
    mapLayerGeoJsonRequests: Dictionary<RestRequest>;
    geoJsons: Dictionary<GeoJSON>;
    layersInfo: Dictionary<LayerInfo>;
    routes: Routes;
    defaultHash: string;
    views: Views;
    reloadKey: number;
    pendingGeoJsonRequests: number;

    constructor(props: Props) {
        super(props);

        this.state = {
            loadingProvinceData: true,
            loadingProgrammeData: true,
            loadingProvinces: true,
            // FIXME: change to false
            loadingSectorData: false,
            loadingProgrammes: true,
            loadingSectors: true,
            loadingIndicators: true,
            loadingGeoJson: false,
            layersInfo: {},
        };
        this.pendingGeoJsonRequests = 0;

        this.defaultHash = 'province';

        this.routes = {
            province: 'Province',
            programme: 'Programme',
            sector: 'Sector',
        };

        this.views = {
            province: {
                component: () => (
                    <MultiProvinceDetailInfo loading={this.state.loadingProvinceData} />
                ),
            },

            programme: {
                component: () => (
                    <MultiProgrammeDetailInfo loading={this.state.loadingProgrammeData} />
                ),
            },

            sector: {
                component: () => (
                    <MultiSectorDetailInfo loading={this.state.loadingSectorData} />
                ),
            },
        };

        this.geoJsons = {};
        this.layersInfo = {};
        this.mapLayerGeoJsonRequests = {};

        this.reloadKey = 0;
    }

    componentDidMount() {
        this.startRequestForProvinceData();
        this.startRequestForProvinces();
        this.reloadProvince();
        this.reloadMunicipalities();
        this.reloadMapLayer();
        this.reloadProgramLayer();
        this.startRequestForProgrammes();
        this.startRequestForProgrammesData();
        this.startRequestForSectors();
        this.startRequestForIndicators();
        this.startRequestForMapLayers();
    }

    componentWillUnmount() {
        if (this.provinceDataRequest) {
            this.provinceDataRequest.stop();
        }
        if (this.provincesRequest) {
            this.provincesRequest.stop();
        }
        if (this.programmeRequest) {
            this.programmeRequest.stop();
        }
        if (this.programmeDataRequest) {
            this.programmeDataRequest.stop();
        }
        if (this.geoJsonRequest) {
            this.geoJsonRequest.stop();
        }
        Object.values(this.mapLayerGeoJsonRequests).forEach(
            r => r.stop(),
        );
        if (this.sectorRequest) {
            this.sectorRequest.stop();
        }
        if (this.indicatorsRequest) {
            this.indicatorsRequest.stop();
        }
        if (this.mapLayersRequest) {
            this.mapLayersRequest.stop();
        }
    }

    startRequestForProvinceData = () => {
        if (this.provinceDataRequest) {
            this.provinceDataRequest.stop();
        }
        const provinceDataRequest = new ProvinceDataGetRequest({
            setState: params => this.setState(params),
            setProvincesData: this.props.setProvincesData,
        });
        this.provinceDataRequest = provinceDataRequest.create();
        this.provinceDataRequest.start();
    }

    startRequestForProvinces = () => {
        if (this.provincesRequest) {
            this.provincesRequest.stop();
        }
        const provincesRequest = new ProvincesGetRequest({
            setState: params => this.setState(params),
            setProvinces: this.props.setProvinces,
        });
        this.provincesRequest = provincesRequest.create();
        this.provincesRequest.start();
    }

    startRequestForProgrammes = () => {
        if (this.programmeRequest) {
            this.programmeRequest.stop();
        }
        const programmeRequest = new ProgrammesGetRequest({
            setState: params => this.setState(params),
            setProgrammes: this.props.setProgrammes,
        });
        this.programmeRequest = programmeRequest.create();
        this.programmeRequest.start();
    }

    startRequestForProgrammesData = () => {
        if (this.programmeDataRequest) {
            this.programmeDataRequest.stop();
        }
        const programmeDataRequest = new ProgrammesDataGetRequest({
            setState: params => this.setState(params),
            setProgrammesData: this.props.setProgrammesData,
        });
        this.programmeDataRequest = programmeDataRequest.create();
        this.programmeDataRequest.start();
    }

    startRequestForSectors = () => {
        if (this.sectorRequest) {
            this.sectorRequest.stop();
        }
        const sectorRequest = new SectorsGetRequest({
            setState: params => this.setState(params),
            setSectors: this.props.setSectors,
        });
        this.sectorRequest = sectorRequest.create();
        this.sectorRequest.start();
    }

    startRequestForIndicators = () => {
        if (this.indicatorsRequest) {
            this.indicatorsRequest.stop();
        }
        const indicatorsRequest = new IndicatorsGetRequest({
            setState: params => this.setState(params),
            setIndicators: this.props.setIndicators,
        });
        this.indicatorsRequest = indicatorsRequest.create();
        this.indicatorsRequest.start();
    }

    startRequestForMapLayers = () => {
        if (this.mapLayersRequest) {
            this.mapLayersRequest.stop();
        }
        const mapLayersRequest = new MapLayersGetRequest({
            setState: params => this.setState(params),
            setMapLayers: this.props.setMapLayers,
        });
        this.mapLayersRequest = mapLayersRequest.create();
        this.mapLayersRequest.start();
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
            setGeoJsons: this.setGeoJsons,
            preLoad: () => {
                this.pendingGeoJsonRequests += 1;
                this.setState({
                    loadingGeoJson: this.pendingGeoJsonRequests > 0,
                });
            },
            postLoad: () => {
                this.pendingGeoJsonRequests -= 1;
                this.setState({
                    loadingGeoJson: this.pendingGeoJsonRequests > 0,
                });
            },
        });

        this.mapLayerGeoJsonRequests[key] = mapLayerGeoJsonRequest.create({ url });
        this.mapLayerGeoJsonRequests[key].start();
    }

    setGeoJsons = (url: string, geoJsons: GeoJSON) => {
        this.geoJsons[url] = geoJsons;
    }

    setLayersInfo = (layersInfo: Dictionary<LayerInfo>) => {
        this.reloadKey += 1;
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

            if (this.geoJsons[url]) {
                layersInfo[key] = {
                    ...layerInfo,
                    geoJson: this.geoJsons[url],
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
        if (!ipss) {
            return;
        }

        this.reloadSelectionToLayers({
            keyPrefix: 'programmeLayer',
            selectedList: [ipss],
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

    renderInformation = () => {
        const {
            selectedProvinces,
            selectedProgrammes,
            selectedSectors,
        } = this.props;

        const showCountryDetails = !(
            selectedProgrammes.length
            || selectedProvinces.length
            || selectedSectors.length
        );

        if (showCountryDetails) {
            return (
                <CountryDetails className={styles.right} />
            );
        }

        return (
            <div className={styles.right} >
                <FixedTabs
                    className={styles.fixedTabs}
                    useHash
                    replaceHistory
                    tabs={this.routes}
                    defaultHash={this.defaultHash}
                />
                <MultiViewContainer
                    useHash
                    views={this.views}
                />
            </div>
        );
    }

    render() {
        // tslint:disable-next-line variable-name
        const Information = this.renderInformation;

        const {
            layersInfo,
            loadingProvinceData,
            loadingProgrammeData,
            loadingSectorData,
            loadingProvinces,
            loadingProgrammes,
            loadingSectors,
            loadingIndicators,
            loadingGeoJson,
        } = this.state;

        const loading = (
            loadingProvinceData || loadingProgrammeData || loadingGeoJson ||
            loadingProvinces || loadingProgrammes || loadingSectors ||
            loadingIndicators || loadingSectorData
        );

        const layers = loadingGeoJson ? [] : [
            ...Object.values(layersInfo).sort((l1, l2) => l1.order - l2.order),
            ...Object.values(layersInfo).filter(
                l => l.separateStroke,
            ).sort((l1, l2) => l1.order - l2.order).map(l => ({
                ...l,
                layerKey: `${l.layerKey}-stroke`,
                type: 'Line',
            })),
        ];

        return (
            <div className={styles.dashboard}>
                <div className={styles.left}>
                    {loadingGeoJson && <LoadingAnimation />}
                    <Filter
                        disabled={loading}
                        onChange={this.handleFilterChange}
                    />
                    <Map className={styles.map}>
                        {layers.map((l: LayerInfo, index: number) => (
                            <GeoJsonLayer
                                key={`${l.layerKey}-layer-${this.reloadKey}`}
                                fill={l.type === 'Fill'}
                                stroke={l.type === 'Line'}
                                point={l.type === 'Point'}
                                {...l}
                            />
                        ))}
                    </Map>
                </div>
                <Information />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    selectedProvinces: dashboardProvincesSelector(state),
    selectedProgrammes: dashboardProgrammesSelector(state),
    selectedSectors: dashboardSectorsSelector(state),
    selectedMapLayers: dashboardMapLayersSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setProvinces: (params: SetProvincesAction) => dispatch(setProvincesAction(params)),
    setDashboardProvince: (provinceId: number) => dispatch(setDashboardProvinceAction(provinceId)),
    setProvincesData: (params: SetProvincesDataAction) => dispatch(setProvincesDataAction(params)),
    setProgrammes: (params: SetProgrammesAction) => dispatch(setProgrammesAction(params)),
    setProgrammesData: (params: SetProgrammesDataAction) =>
        dispatch(setProgrammesDataAction(params)),
    setSectors: (params: SetSectorsAction) => dispatch(setSectorsAction(params)),
    setIndicators: (params: SetIndicatorsAction) => dispatch(setIndicatorsAction(params)),
    setMapLayers: (params: SetMapLayersAction) => dispatch(setMapLayersAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Dashboard);
