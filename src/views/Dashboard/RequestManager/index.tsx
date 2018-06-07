import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import { RestRequest } from '../../../vendor/react-store/utils/rest';
import {
    CoordinatorBuilder,
    Coordinator,
} from '../../../vendor/react-store/utils/coordinate';
import { getHexFromString } from '../../../vendor/react-store/utils/common';

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
    setIndicatorsDataAction,
    setMapLayersAction,
    setGeoJsonsAction,
    setRequestManagerLoadingAction,
    resetRequestManagerLoadingAction,
    dashboardFilterPaneSelector,
    dashboardProvincesSelector,
    dashboardProgrammesSelector,
    dashboardSectorsSelector,
    dashboardMapLayersSelector,
    geoJsonsSelector,
    dashboardIndicatorSelector,
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
    SetIndicatorsDataAction,
    SetMapLayersAction,
    SetRequestManagerLoadingAction,
    DashboardFilter,
    Province,
    Programme,
    Sector,
    MapLayer,
    GeoJSONS,
    Dictionary,
    SetGeoJsonsAction,
    IndicatorData,
} from '../../../redux/interface';

import CountriesDataGetRequest from './requests/CountriesDataGetRequest';
import IndicatorsGetRequest from './requests/IndicatorsGetRequest';
import IndicatorsDataGetRequest from './requests/IndicatorsDataGetRequest';
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
    loading: boolean;
}
interface PropsFromState {
    faramState: DashboardFilter;
    selectedProvinces: Province[];
    selectedProgrammes: Programme[];
    selectedSectors: Sector[];
    selectedMapLayers: MapLayer[];
    geoJsons: GeoJSONS;
    selectedIndicator?: IndicatorData;
}
interface PropsFromDispatch {
    setCountriesData(params: SetCountriesDataAction): void;
    setProvinces(params: SetProvincesAction): void;
    setProvincesData(params: SetProvincesDataAction): void;
    setProgrammes(params: SetProgrammesAction): void;
    setProgrammesData(params: SetProgrammesDataAction): void;
    setSectors(params: SetSectorsAction): void;
    setIndicators(params: SetIndicatorsAction): void;
    setIndicatorsData: (params: SetIndicatorsDataAction) => void;
    setMapLayers(params: SetMapLayersAction): void;
    setGeoJsons: (params: SetGeoJsonsAction) => void;
    setDashboardLoadings(params: SetRequestManagerLoadingAction): void;
    resetRequestManagerLoading(): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State { }

export class RequestManager extends React.PureComponent<Props, State>{
    geoJsonRequestCoordinator: Coordinator;
    countryDataRequest: RestRequest;
    indicatorsRequest: RestRequest;
    indicatorsDataRequest: RestRequest;
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

    componentWillMount() {
        this.props.resetRequestManagerLoading();
    }

    componentDidMount() {
        this.startRequestForCountriesData();
        this.startRequestForProvinceData();
        this.startRequestForProvinces();
        this.startRequestForProgrammes();
        this.startRequestForProgrammesData();
        this.startRequestForSectors();
        this.startRequestForIndicators();
        this.startRequestForIndicatorsData();
        this.startRequestForMapLayers();

        if (!this.props.loading) {
            this.reloadProvince(this.props);
            this.reloadMunicipalities(this.props);
            this.reloadMapLayer(this.props);
            this.reloadProgramLayer(this.props);
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        if (this.props.loading !== nextProps.loading) {
            this.reloadProvince(nextProps);
            this.reloadMunicipalities(nextProps);
            this.reloadMapLayer(nextProps);
            this.reloadProgramLayer(nextProps);
        } else {
            if (this.props.selectedProvinces !== nextProps.selectedProvinces ||
                this.props.selectedIndicator !== nextProps.selectedIndicator) {
                this.reloadProvince(nextProps);
                this.reloadMunicipalities(nextProps);
            }
            if (this.props.selectedProgrammes !== nextProps.selectedProgrammes) {
                this.reloadProgramLayer(nextProps);
            }
            if (this.props.selectedMapLayers !== nextProps.selectedMapLayers) {
                this.reloadMapLayer(nextProps);
            }
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
        if (this.indicatorsDataRequest) {
            this.indicatorsDataRequest.stop();
        }
        if (this.mapLayersRequest) {
            this.mapLayersRequest.stop();
        }
        this.geoJsonRequestCoordinator.stop();
    }

    getProvinceStyle = (props: Props, provinceId: number) => {
        const { selectedIndicator } = props;

        if (!selectedIndicator) {
            return {};
        }

        const value = selectedIndicator.provinces[provinceId].value;
        if (!value) {
            return {};
        }

        const minValue = selectedIndicator.minValue;
        const maxValue = selectedIndicator.maxValue;

        if (maxValue === minValue) {
            return {};
        }

        const fraction = (value - minValue) / (maxValue - minValue);
        const offset = 0.1;
        const fractionWithOffset = fraction * (0.95 - offset) + offset;
        
        return {
            color: '#008181',
            opacity: fractionWithOffset,
        };
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

    startRequestForIndicatorsData = () => {
        if (this.indicatorsDataRequest) {
            this.indicatorsDataRequest.stop();
        }
        const indicatorsDataRequest = new IndicatorsDataGetRequest({
            setState: params => this.setState(params),
            setIndicatorsData: this.props.setIndicatorsData,
            setLoadings: this.props.setDashboardLoadings,
        });
        this.indicatorsDataRequest = indicatorsDataRequest.create();
        this.indicatorsDataRequest.start();
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

    reloadSelectionToLayers = ({
        keyPrefix, selectedList, overrides = {},
    } : {
        keyPrefix: string,
        selectedList: any[],
        overrides?: any,
    }) => {
        const { layersInfo } = this.props;
        const settings = {};
        const unsetLayers: string[] = [];

        Object.keys(layersInfo).filter((key: string) => key.startsWith(`${keyPrefix}-`))
            .forEach((key: string) => {
                unsetLayers.push(key);
            });

        this.props.setLayersInfo({ $unset: unsetLayers });

        selectedList.forEach((selection) => {
            const key = `${keyPrefix}-${selection.id}`;
            const url = overrides.url || selection.file;
            let type = overrides.type || selection.type;

            if (type === 'Polygon') {
                type = 'Fill';
            }

            const layerInfo = {
                ...selection,
                ...overrides,
                type,
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

        const country = {
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
            opacity: (selectedProvinces.length > 0) ? 0.35 : 0.8,
        };

        const selections = [
            country,
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
                color: '#008181',
                strokeColor: '#fff',
                ...this.getProvinceStyle(props, selectedProvince.id),
            })),
            ...selectedProvinces.map(selectedProvince => ({
                id: `${selectedProvince.id}-border`,
                file: urlForCountryGeoJson,
                order: -1,
                visibilityKey: 'Province',
                visibilityValue: selectedProvince.id,
                type: 'Line',
                opacity: 1.0,
                strokeWidth: 2,
                color: '#fff',
            })),
        ];

        this.reloadSelectionToLayers({
            keyPrefix: 'province',
            selectedList: selections,
        });
    }

    reloadMunicipalities = (props: Props) => {
        const { selectedProvinces } = props;
        const selections = selectedProvinces.length > 0 ? [] : [{
            id: 'municipalities',
            file: urlForMunicipalitiesGeoJson,
            type: 'Line',
            order: 2,
            opacity: 0.2,
        }];

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
            overrides: {
                visibility: 'ActLevel',
                type: 'Fill',
                color: getHexFromString('ipssj'),
                url: urlForIpssjGeoJson,
                order: 3,
            },
        });
    }

    reloadMapLayer = (props: Props) => {
        this.reloadSelectionToLayers({
            keyPrefix: 'mapLayer',
            selectedList: props.selectedMapLayers.map(l => ({
                ...l,
                color: getHexFromString(l.layerName),
            })),
            overrides: {
                order: 4,
            },
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
    selectedIndicator: dashboardIndicatorSelector(state),
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
    setIndicatorsData: (params: SetIndicatorsDataAction) =>
        dispatch(setIndicatorsDataAction(params)),
    setMapLayers: (params: SetMapLayersAction) => dispatch(setMapLayersAction(params)),
    setGeoJsons: (params: SetGeoJsonsAction) => dispatch(setGeoJsonsAction(params)),
    setDashboardLoadings: (params: SetRequestManagerLoadingAction) =>
        dispatch(setRequestManagerLoadingAction(params)),
    resetRequestManagerLoading: () => dispatch(resetRequestManagerLoadingAction()),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(RequestManager);
