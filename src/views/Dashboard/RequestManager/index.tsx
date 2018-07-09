import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import mapStyles from '../../../constants/mapStyles';

import { RestRequest } from '../../../vendor/react-store/utils/rest';
import {
    CoordinatorBuilder,
    Coordinator,
} from '../../../vendor/react-store/utils/coordinate';
import { getHexFromString } from '../../../vendor/react-store/utils/common';

import {
    urlForCountryGeoJson,
    urlForMunicipalitiesGeoJson,
    createUrlForTileLayer,
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
    dashboardMunicipalitiesSelector,
    dashboardProgrammesSelector,
    dashboardSectorsSelector,
    dashboardMapLayersSelector,
    dashboardRasterMapLayerSelector,
    geoJsonsSelector,
    dashboardIndicatorSelector,
    provincesSelector,
    municipalitiesSelector,
    setMunicipalitiesAction,
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
    Municipality,
    Programme,
    MunicipalityProgramme,
    Sector,
    MapLayer,
    GeoJSON,
    GeoJSONS,
    Dictionary,
    SetGeoJsonsAction,
    IndicatorData,
    MapLayerProps,
    SetMunicipalitiesAction,
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
import MunicipalitiesGetRequest from './requests/MunicipalitiesGetRequest';

interface OwnProps {
    layersInfo: Dictionary<MapLayerProps>;
    handleProvinceClick(key: string): void;
    handleMunicipalityClick(key: string): void;
    setLayersInfo(settings: object): void;
    renderMunicipalityTooltip(properties: object): void;
    loading: boolean;
}
interface PropsFromState {
    faramState: DashboardFilter;
    selectedProvinces: Province[];
    selectedMunicipalities: Municipality[];
    selectedProgrammes: Programme[];
    selectedSectors: Sector[];
    selectedMapLayers: MapLayer[];
    selectedRasterMapLayer?: MapLayer;
    geoJsons: GeoJSONS;
    selectedIndicator?: IndicatorData;
    provinces: Province[];
    municipalities: Municipality[];
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
    setMunicipalities(params: SetMunicipalitiesAction): void;
    resetRequestManagerLoading(): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State { }

const emptyList: any[] = [];
const emptyObject: any = {};

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
    municipalitiesRequest: RestRequest;

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
        this.startRequestForMunicipalities();

        if (!this.props.loading) {
            this.reloadRasterMapLayer(this.props);
            this.reloadProvince(this.props);
            this.reloadMunicipalities(this.props);
            this.reloadMapLayer(this.props);
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        if (this.props.loading !== nextProps.loading) {
            this.reloadProvince(nextProps);
            this.reloadMunicipalities(nextProps);
            this.reloadMapLayer(nextProps);
        } else {
            if (this.props.selectedRasterMapLayer !== nextProps.selectedRasterMapLayer) {
                this.reloadRasterMapLayer(nextProps);
            }
            if (
                this.props.selectedProvinces !== nextProps.selectedProvinces ||
                this.props.selectedIndicator !== nextProps.selectedIndicator ||
                this.props.selectedProgrammes !== nextProps.selectedProgrammes ||
                this.props.selectedMunicipalities !== nextProps.selectedMunicipalities
            ) {
                this.reloadProvince(nextProps);
                this.reloadMunicipalities(nextProps);
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
        if (this.municipalitiesRequest) {
            this.municipalitiesRequest.stop();
        }
        this.geoJsonRequestCoordinator.stop();
    }

    getSelectedProvincesStyle = (props: Props) => {
        const {
            selectedProvinces,
            provinces,
        } = props;
        const styles = {};

        provinces.forEach((province) => {
            // everything except the selected province is transparent
            styles[province.id] = mapStyles.transparent;
        });

        if (selectedProvinces) {
            selectedProvinces.forEach((province) => {
                styles[province.id] = mapStyles.selectedProvinces;
            });
        }

        return styles;
    }

    getMunicipalityStyle = (props: Props) => {
        const {
            selectedProgrammes,
            selectedMunicipalities,
            selectedIndicator,
            municipalities,
        } = props;
        const styles = {};
        const selectedStyles = {};

        selectedMunicipalities.forEach((municipality) => {
            selectedStyles[municipality.hlcitCode] = mapStyles.municipalitiesSelected;
        });

        if (selectedIndicator) {
            municipalities.forEach((municipality) => {
                styles[municipality.hlcitCode] = {
                    ...mapStyles.municipalities,
                    ...(selectedStyles[municipality.hlcitCode] || emptyObject),
                    opacity: 0,
                };
            });
            return styles;
        }

        if (selectedProgrammes.length === 0) {
            municipalities.forEach((municipality) => {
                styles[municipality.hlcitCode] = {
                    ...mapStyles.municipalities,
                    ...(selectedStyles[municipality.hlcitCode] || emptyObject),
                };
            });
            return styles;
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

        municipalities.forEach((municipality) => {
            const value = budgets[municipality.hlcitCode];
            const fraction = (value - minValue) / (maxValue - minValue);
            const offset = 0.25;
            const fractionWithOffset = fraction * (0.85 - offset) + offset;

            styles[municipality.hlcitCode] = {
                ...mapStyles.municipalities,
                ...(selectedStyles[municipality.hlcitCode] || emptyObject),
                opacity: fractionWithOffset,
            };
        });
        return styles;
    }

    getProvincesStyle = (props: Props) => {
        const {
            selectedIndicator,
            provinces,
        } = props;
        const styles = {};

        provinces.forEach((province) => {
            styles[province.id] = mapStyles.provinces;
        });

        if (!selectedIndicator) {
            return styles;
        }

        const minValue = selectedIndicator.minValue;
        const maxValue = selectedIndicator.maxValue;

        Object.keys(selectedIndicator.provinces).forEach((provinceId) => {
            if (maxValue === minValue) {
                return;
            }

            const value = selectedIndicator.provinces[provinceId].value;
            if (!value) {
                return;
            }

            const fraction = (value - minValue) / (maxValue - minValue);
            const offset = 0.25;
            const fractionWithOffset = fraction * (0.85 - offset) + offset;

            styles[provinceId] = {
                ...styles[provinceId],
                ...mapStyles.indicator,
                opacity: fractionWithOffset,
            };
        });

        return styles;
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

    startRequestForMunicipalities = () => {
        if (this.municipalitiesRequest) {
            this.municipalitiesRequest.stop();
        }
        const municipalitiesRequest = new MunicipalitiesGetRequest({
            setState: params => this.setState(params),
            setMunicipalities: this.props.setMunicipalities,
            setLoadings: this.props.setDashboardLoadings,
        });
        this.municipalitiesRequest = municipalitiesRequest.create();
        this.municipalitiesRequest.start();
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

            const layerInfo = {
                ...selection,
                ...overrides,
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
        const provinceIds = selectedProvinces.map(p => p.id);

        const selections = [{
            style: this.getProvincesStyle(props),
            types: ['Polygon'],
            separateStroke: true,
            separateStyle: this.getSelectedProvincesStyle(props),
            separateStyleType: 'Line',

            id: 'country',
            file: urlForCountryGeoJson,
            order: 1,
            stylePerElement: true,
            handleHover: true,
            showPopUp: true,
            idKey: 'Province',
            integerId: true,
            labelKey: 'Province',
            onClick: { fill: props.handleProvinceClick },
            visibleCondition: {
                fill: ['!in', 'Province', ...provinceIds],
            },
        }];

        this.reloadSelectionToLayers({
            keyPrefix: 'province',
            selectedList: selections,
        });
    }

    reloadMunicipalities = (props: Props) => {
        const { selectedProvinces } = props;
        const provinceIds = selectedProvinces.map(p => String(p.id));

        const selections = [
            {
                id: 'municipalities',
                file: urlForMunicipalitiesGeoJson,
                order: 0,
                types: ['Line', 'Polygon'],
                style: this.getMunicipalityStyle(props),
                idKey: 'HLCIT_CODE',
                labelKey: 'LU_Name',
                stylePerElement: true,
            },
            {
                id: 'municipalities-hover',
                file: urlForMunicipalitiesGeoJson,
                order: 3,
                types: ['Polygon'],
                style: mapStyles.municipalitiesHover,
                handleHover: true,
                idKey: 'HLCIT_CODE',
                labelKey: 'LU_Name',

                onClick: { fill: props.handleMunicipalityClick },

                visibleCondition: {
                    fill: ['in', 'STATE', ...provinceIds],
                },

                tooltipModifier: props.renderMunicipalityTooltip,
            },
        ];

        this.reloadSelectionToLayers({
            keyPrefix: 'municipality',
            selectedList: selections,
        });
    }

    reloadMapLayer = (props: Props) => {
        this.reloadSelectionToLayers({
            keyPrefix: 'mapLayer',
            selectedList: props.selectedMapLayers.map(l => ({
                ...l,
                title: l.layerName,
                color: getHexFromString(l.layerName),
                types: [l.type],
                style: {
                    color: getHexFromString(l.layerName),
                },
                order: (l.type === 'Polygon') ? -1 : 10,
            })),
        });
    }

    reloadRasterMapLayer = (props: Props) => {
        const { selectedRasterMapLayer: mapLayer, setLayersInfo } = props;
        if (!mapLayer) {
            setLayersInfo({
                $unset: ['rasterLayer'],
            });
            return;
        }
        const url = createUrlForTileLayer(mapLayer.layerServerUrl || '', {
            format: 'image/png',
            version: '1.1.0',
            service: 'WMS',
            request: 'GetMap',
            srs: 'EPSG:3857',
            width: 256,
            height: 256,
            transparent: 'true',
            layers: mapLayer.layerPath || '',
        });

        const settings = {
            rasterLayer: {
                $set: {
                    layerKey: 'rasterLayer',
                    types: ['Tile'],
                    tiles: [`${url}&bbox={bbox-epsg-3857}`],
                    tileSize: 256,
                    order: -100,
                    donotReload: true,
                },
            },
        };
        setLayersInfo(settings);
    }

    render() {
        return null;
    }
}

const mapStateToProps = (state: RootState) => ({
    faramState: dashboardFilterPaneSelector(state),
    selectedProvinces: dashboardProvincesSelector(state),
    selectedMunicipalities: dashboardMunicipalitiesSelector(state),
    selectedProgrammes: dashboardProgrammesSelector(state),
    selectedSectors: dashboardSectorsSelector(state),
    selectedMapLayers: dashboardMapLayersSelector(state),
    selectedRasterMapLayer: dashboardRasterMapLayerSelector(state),
    geoJsons: geoJsonsSelector(state),
    selectedIndicator: dashboardIndicatorSelector(state),
    provinces: provincesSelector(state),
    municipalities: municipalitiesSelector(state),
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
    setMunicipalities: (params: SetMunicipalitiesAction) =>
        dispatch(setMunicipalitiesAction(params)),
    resetRequestManagerLoading: () => dispatch(resetRequestManagerLoadingAction()),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(RequestManager);
