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

import Map, {
    Layer,
    GeoJSON,
    sameArrays,
} from '../../components/Map';

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
import CountryGeoJsonGetRequest from './requests/CountryGeoJsonGetRequest';
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

interface State {
    loadingProvinceData: boolean;
    loadingProgrammeData: boolean;
    loadingSectorData: boolean;
    loadingProvinces: boolean;
    loadingProgrammes: boolean;
    loadingSectors: boolean;
    loadingGeoJson: boolean;
    loadingIndicators: boolean;
    geoJson?: GeoJSON;
    geoJsonIdKey: string;
    geoJsonLabelKey: string;

    mapLayers: {
        [key: string]: Layer;
    };
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

const sameArraysIgnoreOrder = (a: any[], b: any[]) => (
    sameArrays(a.sort(), b.sort())
);

export class Dashboard extends React.PureComponent<Props, State>{
    provinceDataRequest: RestRequest;
    provincesRequest: RestRequest;
    programmeRequest: RestRequest;
    sectorRequest: RestRequest;
    indicatorsRequest: RestRequest;
    mapLayersRequest: RestRequest;
    programmeDataRequest: RestRequest;
    geoJsonRequest: RestRequest;
    mapLayerGeoJsonRequests: {
        [key: string]: RestRequest;
    };

    geoJsons: {
        [key: string]: GeoJSON,
    };

    routes: Routes;
    defaultHash: string;
    views: Views;

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
            geoJson: undefined,
            geoJsonIdKey: 'id',
            geoJsonLabelKey: 'label',
            mapLayers: {},
        };

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
        this.mapLayerGeoJsonRequests = {};
    }

    componentDidMount() {
        this.startRequestForProvinceData();
        this.startRequestForProvinces();
        this.reloadGeoJson();
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

    startRequestForCountryGeoJson = (
        url: string,
        geoJsonIdKey: string,
        geoJsonLabelKey: string,
    ) => {
        if (this.geoJsonRequest) {
            this.geoJsonRequest.stop();
        }
        const geoJsonRequest = new CountryGeoJsonGetRequest({
            setState: params => this.setState(params),
            setGeoJsons: this.setGeoJsons,
        });
        this.geoJsonRequest = geoJsonRequest.create({
            url,
            geoJsonIdKey,
            geoJsonLabelKey,
        });
        this.geoJsonRequest.start();
    }

    startRequestForMapLayerGeoJson = (
        key: string,
        url: string,
        type: string,
        color?: string,
        highlightKey?: string,
    ) => {
        if (this.mapLayerGeoJsonRequests[key]) {
            this.mapLayerGeoJsonRequests[key].stop();
        }

        const mapLayerGeoJsonRequest = new MapLayerGeoJsonGetRequest({
            setMapLayerGeoJson: (geoJson: GeoJSON) => {
                const mapLayers = { ...this.state.mapLayers };
                mapLayers[key] = {
                    key,
                    geoJson,
                    type,
                    color,
                    highlightKey,
                };
                this.setState({ mapLayers });
            },
            setGeoJsons: this.setGeoJsons,
        });

        this.mapLayerGeoJsonRequests[key] = mapLayerGeoJsonRequest.create({ url });
        this.mapLayerGeoJsonRequests[key].start();
    }

    setGeoJsons = (url: string, geoJsons: GeoJSON) => {
        this.geoJsons[url] = geoJsons;
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
        this.setState({ loadingGeoJson: true }, () => {
            this.reloadGeoJson();
            this.reloadMunicipalities();
        });
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

    reloadGeoJson = () => {
        const { selectedProvinces } = this.props;

        const geosJson: {url: string, idKey: string, labelKey: string }[] = [];

        if (!selectedProvinces.length) {
            geosJson.push({
                url: urlForCountryGeoJson,
                idKey: 'Province',
                labelKey: 'Province',
            });
        } else {
            selectedProvinces.forEach((selectedProvince) => {
                geosJson.push({
                    url: createUrlForProvinceGeoJson(selectedProvince.id),
                    idKey: 'FIRST_DCOD',
                    labelKey: 'FIRST_DIST',
                });
            });
        }

        geosJson.forEach((geoJson) => {
            // TODO: Show all selected provinces in map
            const { url, idKey, labelKey } = geoJson;
            if (this.geoJsons[url]) {
                this.setState({
                    geoJsonIdKey: idKey,
                    geoJsonLabelKey: labelKey,
                    geoJson: this.geoJsons[url],
                    loadingGeoJson: false,
                });
                return;
            }
            this.startRequestForCountryGeoJson(url, idKey, labelKey);
        });
    }

    reloadMunicipalities = () => {
        const key = 'municipalities';
        const { selectedProvinces } = this.props;
        if (selectedProvinces.length) {
            const mapLayers = { ...this.state.mapLayers };
            delete mapLayers[key];
            this.setState({ mapLayers });
            return;
        }

        const url = urlForMunicipalitiesGeoJson;
        const type = 'Line';
        const color = '#ffffff';

        if (this.geoJsons[url]) {
            const mapLayers = { ...this.state.mapLayers };
            mapLayers[key] = {
                key,
                type,
                color,
                geoJson: this.geoJsons[url],
            };
            this.setState({ mapLayers });
            return;
        }

        this.startRequestForMapLayerGeoJson(key, url, type, color);
    }

    reloadMapLayer = () => {
        const key = 'map-layer';
        const { selectedMapLayers } = this.props;
        if (!selectedMapLayers.filter(selectedMapLayer => selectedMapLayer.file).length) {
            const mapLayers = { ...this.state.mapLayers };
            delete mapLayers[key];
            this.setState({ mapLayers });
            return;
        }

        selectedMapLayers.forEach((selectedMapLayer) => {
            const url = selectedMapLayer.file;
            let type = selectedMapLayer.type;
            if (type === 'Polygon') {
                type = 'Fill';
            }
            const color = '#ffa80d';

            if (this.geoJsons[url]) {
                const mapLayers = { ...this.state.mapLayers };
                mapLayers[key] = {
                    key,
                    type,
                    color,
                    geoJson: this.geoJsons[url],
                };
                this.setState({ mapLayers });
                return;
            }

            this.startRequestForMapLayerGeoJson(key, url, type, color);
        });
    }

    reloadProgramLayer = () => {
        const key = 'program-layer';
        const { selectedProgrammes } = this.props;

        if (!selectedProgrammes.find(programme => programme.id === 6)) {
            const mapLayers = { ...this.state.mapLayers };
            delete mapLayers[key];
            this.setState({ mapLayers });
            return;
        }

        const url = urlForIpssjGeoJson;
        const highlightKey = 'ActLevel';
        const type = 'Fill';

        if (this.geoJsons[url]) {
            const mapLayers = { ...this.state.mapLayers };
            mapLayers[key] = {
                key,
                type,
                highlightKey,
                geoJson: this.geoJsons[url],
            };
            this.setState({ mapLayers });
            return;
        }

        this.startRequestForMapLayerGeoJson(key, url, type, undefined, highlightKey);
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
            geoJson,
            geoJsonLabelKey,
            geoJsonIdKey,
            mapLayers,
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
            loadingProvinceData || loadingProgrammeData ||  loadingGeoJson ||
            loadingProvinces || loadingProgrammes || loadingSectors ||
            loadingIndicators || loadingSectorData
        );

        return (
            <div className={styles.dashboard}>
                <div className={styles.left}>
                    {loadingGeoJson && <LoadingAnimation />}
                    <Filter
                        disabled={loading}
                        onChange={this.handleFilterChange}
                    />
                    <Map
                        className={styles.map}
                        geojson={geoJson}
                        idKey={geoJsonIdKey}
                        labelKey={geoJsonLabelKey}
                        onClick={this.handleMapClick}
                        layers={Object.values(mapLayers)}
                    />
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
