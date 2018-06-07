import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import { RestRequest } from '../../../vendor/react-store/utils/rest';
import {
    CoordinatorBuilder,
    Coordinator,
} from '../../../vendor/react-store/utils/coordinate';

import { LayerInfo } from '../../../components/Map';
import { GeoJSON } from '../../../components/Map/MapLayer';
import {
    createUrlForProvinceGeoJson,
    urlForCountryGeoJson,
    urlForMunicipalitiesGeoJson,
    urlForIpssjGeoJson,
} from '../../../rest';

import {
    setCountriesDataAction,
    setProvincesAction,
    setProvincesDataAction,
    setProgrammesAction,
    setProgrammesDataAction,
    setSectorsAction,
    setIndicatorsAction,
    setMapLayersAction,
    setGeoJsonsAction,
    setRequestManagerLoadingAction,
    dashboardFilterPaneSelector,
    dashboardProvincesSelector,
    dashboardProgrammesSelector,
    dashboardSectorsSelector,
    dashboardMapLayersSelector,
    geoJsonsSelector,
} from '../../../redux';

import {
    RootState,
    SetProvincesAction,
    SetProvincesDataAction,
    SetCountriesDataAction,
    SetProgrammesAction,
    SetProgrammesDataAction,
    SetSectorsAction,
    SetIndicatorsAction,
    SetMapLayersAction,
    SetRequestManagerLoadingAction,
    DashboardFilter,
    DashboardFilterParams,
    Province,
    Programme,
    Sector,
    MapLayer,
    GeoJSONS,
    Dictionary,
    SetGeoJsonsAction,
} from '../../../redux/interface';

import CountriesDataGetRequest from './requests/CountriesDataGetRequest';
import IndicatorsGetRequest from './requests/IndicatorsGetRequest';
import MapLayersGetRequest from './requests/MapLayersGetRequest';
import ProgrammesDataGetRequest from './requests/ProgrammesDataGetRequest';
import ProgrammesGetRequest from './requests/ProgrammesGetRequest';
import ProvinceDataGetRequest from './requests/ProvinceDataGetRequest';
import ProvincesGetRequest from './requests/ProvincesGetRequest';
import SectorsGetRequest from './requests/SectorsGetRequest';
import MapLayerGeoJsonGetRequest from './requests/MapLayerGeoJsonGetRequest';

interface OwnProps {
    layersInfo: Dictionary<LayerInfo>;
    handleMapClick(key: string): void;
    setLayersInfo(settings: object): void;
}
interface PropsFromState {
    faramState: DashboardFilter;
    selectedProvinces: Province[];
    selectedProgrammes: Programme[];
    selectedSectors: Sector[];
    selectedMapLayers: MapLayer[];
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
    setGeoJsons: (params: SetGeoJsonsAction) => void;
    setDashboardLoadings(params: SetRequestManagerLoadingAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State { }

const emptyArray: any[] = [];
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

export class RequestManager extends React.PureComponent<Props, State>{
    geoJsonRequestCoordinator: Coordinator;
    countryDataRequest: RestRequest;
    indicatorsRequest: RestRequest;
    mapLayersRequest: RestRequest;
    programmeDataRequest: RestRequest;
    programmeRequest: RestRequest;
    provinceDataRequest: RestRequest;
    provincesRequest: RestRequest;
    sectorRequest: RestRequest;

    constructor(props: Props) {
        super(props);

        this.geoJsonRequestCoordinator = new CoordinatorBuilder()
            .maxActiveActors(10)
            .preSession(() => {
                this.props.setDashboardLoadings({
                    loadingGeoJson: true,
                });
            })
            .postSession(() => {
                this.props.setDashboardLoadings({
                    loadingGeoJson: false,
                });
            })
            .build();
    }

    componentDidMount() {
        this.startRequestForCountriesData();
        this.startRequestForProvinceData();
        this.startRequestForProvinces();
        this.startRequestForProgrammes();
        this.startRequestForProgrammesData();
        this.startRequestForSectors();
        this.startRequestForIndicators();
        this.startRequestForMapLayers();
        this.reloadProvince(this.props);
        this.reloadMunicipalities(this.props);
        this.reloadMapLayer(this.props);
        this.reloadProgramLayer(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
        const { faramState: { filters: oldFilters } } = this.props;
        const { faramState: { filters } } = nextProps;
        if (filters !== oldFilters) {
            this.handleFilterChange(oldFilters, filters, nextProps);
        }
    }

    componentWillUnmount() {
        if (this.countryDataRequest) {
            this.countryDataRequest.stop();
        }
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
        if (this.sectorRequest) {
            this.sectorRequest.stop();
        }
        if (this.indicatorsRequest) {
            this.indicatorsRequest.stop();
        }
        if (this.mapLayersRequest) {
            this.mapLayersRequest.stop();
        }
        this.geoJsonRequestCoordinator.stop();
    }

    startRequestForCountriesData = () => {
        if (this.countryDataRequest) {
            this.countryDataRequest.stop();
        }
        const countryDataRequest = new CountriesDataGetRequest({
            setState: params => this.setState(params),
            setCountriesData: this.props.setCountriesData,
            setLoadings: this.props.setDashboardLoadings,
        });
        this.countryDataRequest = countryDataRequest.create();
        this.countryDataRequest.start();
    }

    startRequestForProvinceData = () => {
        if (this.provinceDataRequest) {
            this.provinceDataRequest.stop();
        }
        const provinceDataRequest = new ProvinceDataGetRequest({
            setState: params => this.setState(params),
            setProvincesData: this.props.setProvincesData,
            setLoadings: this.props.setDashboardLoadings,
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
            setLoadings: this.props.setDashboardLoadings,
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
            setLoadings: this.props.setDashboardLoadings,
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
            setLoadings: this.props.setDashboardLoadings,
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
            setLoadings: this.props.setDashboardLoadings,
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
            setLoadings: this.props.setDashboardLoadings,
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
            setLoadings: this.props.setDashboardLoadings,
        });
        this.mapLayersRequest = mapLayersRequest.create();
        this.mapLayersRequest.start();
    }

    addRequestForMapLayerGeoJson = (
        key: string,
        url: string,
        responseHandler: (geoJson: GeoJSON) => void,
    ) => {
        if (!url) {
            // NOTE: Ignore undefined/null urls
            console.warn('invalid url for map layer geo json for', key);
            return;
        }

        const mapLayerGeoJsonRequest = new MapLayerGeoJsonGetRequest({
            setMapLayerGeoJson: responseHandler,
            setGeoJsons: this.props.setGeoJsons,
            getCoordinator: () => this.geoJsonRequestCoordinator,
        }).create({ url, key });

        this.geoJsonRequestCoordinator.add(key, mapLayerGeoJsonRequest);
        this.geoJsonRequestCoordinator.start();
    }

    handleFilterChange = (
        oldValues: DashboardFilterParams,
        values: DashboardFilterParams,
        props: Props,
    ) => {
        const {
            provincesId = emptyArray,
            programmesId = emptyArray,
            sectorsId = emptyArray,
            mapLayersId = emptyArray,
        } = values;

        const {
            provincesId: oldProvincesId = emptyArray,
            programmesId: oldProgrammesId = emptyArray,
            sectorsId: oldSectorsId = emptyArray,
            mapLayersId: oldMapLayersId = emptyArray,
        } = oldValues;

        if (!sameArraysIgnoreOrder(oldProvincesId, provincesId)) {
            this.reloadProvince(props);
            this.reloadMunicipalities(props);
        }
        if (!sameArraysIgnoreOrder(oldProgrammesId, programmesId)) {
            this.reloadProgramLayer(props);
        }
        if (!sameArraysIgnoreOrder(oldSectorsId, sectorsId)) {
            // window.location.hash = '#/sector';
        }
        if (!sameArraysIgnoreOrder(oldMapLayersId, mapLayersId)) {
            this.reloadMapLayer(props);
        }
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
        const { layersInfo } = this.props;
        const settings = {};
        const unsetLayers: string[] = [];

        Object.keys(layersInfo).filter((key: string) => key.startsWith(`${keyPrefix}-`))
            .forEach((key: string) => {
                unsetLayers.push(key);
            });

        this.props.setLayersInfo({ $unset: unsetLayers });

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
                settings[key] = {
                    $set: {
                        ...layerInfo,
                        geoJson: this.props.geoJsons[url],
                    },
                };
            } else {
                this.addRequestForMapLayerGeoJson(key, url,  (geoJson: GeoJSON) => {
                    this.props.setLayersInfo({
                        [key] : {
                            $set: {
                                ...layerInfo,
                                geoJson,
                            },
                        },
                    });
                });
            }
        });
        this.props.setLayersInfo(settings);
    }

    reloadProvince = (props: Props) => {
        const { selectedProvinces } = props;
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
                onClick: this.props.handleMapClick,
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

    reloadMunicipalities = (props: Props) => {
        const { selectedProvinces } = props;
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

    reloadProgramLayer = (props: Props) => {
        const { selectedProgrammes } = props;
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

    reloadMapLayer = (props: Props) => {
        this.reloadSelectionToLayers({
            keyPrefix: 'mapLayer',
            selectedList: props.selectedMapLayers,
            color: '#e74c3c',
            orderOverride: 4,
        });
    }

    render() {
        return null;
    }
}

const mapStateToProps = (state: RootState) => ({
    faramState: dashboardFilterPaneSelector(state),
    selectedProvinces: dashboardProvincesSelector(state),
    selectedProgrammes: dashboardProgrammesSelector(state),
    selectedSectors: dashboardSectorsSelector(state),
    selectedMapLayers: dashboardMapLayersSelector(state),
    geoJsons: geoJsonsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setCountriesData: (params: SetCountriesDataAction) => dispatch(setCountriesDataAction(params)),
    setProvinces: (params: SetProvincesAction) => dispatch(setProvincesAction(params)),
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
)(RequestManager);
