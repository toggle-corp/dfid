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
} from '../../rest';
import {
    setProvincesAction,
    setProvincesDataAction,
    setProgrammesAction,
    setProgrammesDataAction,
    setSectorsAction,
    setIndicatorsAction,
    setMapLayersAction,
    dashboardProvinceSelector,
    dashboardProgrammeSelector,
    dashboardSectorSelector,
    dashboardProgrammeDataSelector,
} from '../../redux';

import {
    RootState,
    ProgrammeData,
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
} from '../../redux/interface';

import Map, { GeoJSON } from '../../components/Map';

import CountryDetails from '../Dashboard/CountryDetails';
import Filter from './Filter';
import ProvinceDetailInfo from './ProvinceDetailInfo';
import ProgrammeDetails from '../Dashboard/ProgrammeDetails';
import SectorDetailInfo from '../Dashboard/SectorDetailInfo';

import ProvinceDataGetRequest from './requests/ProvinceDataGetRequest';
import ProvincesGetRequest from './requests/ProvincesGetRequest';
import ProgrammesGetRequest from './requests/ProgrammesGetRequest';
import SectorsGetRequest from './requests/SectorsGetRequest';
import ProgrammesDataGetRequest from './requests/ProgrammesDataGetRequest';
import CountryGeoJsonGetRequest from './requests/CountryGeoJsonGetRequest';
import IndicatorsGetRequest from './requests/IndicatorsGetRequest';
import MapLayersGetRequest from './requests/MapLayersGetRequest';

import styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    selectedProvince: Province;
    selectedProgramme: Programme;
    selectedProgrammeData: ProgrammeData;
    selectedSector: Sector;
}
interface PropsFromDispatch {
    setProvinces(params: SetProvincesAction): void;
    setProvincesData(params: SetProvincesDataAction): void;
    setProgrammes(params: SetProgrammesAction): void;
    setProgrammesData(params: SetProgrammesDataAction): void;
    setSectors(params: SetSectorsAction): void;
    setIndicators(params: SetIndicatorsAction): void;
    setMapLayers(params: SetMapLayersAction): void;
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

export class Dashboard extends React.PureComponent<Props, State>{
    provinceDataRequest: RestRequest;
    provincesRequest: RestRequest;
    programmeRequest: RestRequest;
    sectorRequest: RestRequest;
    indicatorsRequest: RestRequest;
    mapLayersRequest: RestRequest;
    programmeDataRequest: RestRequest;
    geoJsonRequest: RestRequest;

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
            loadingSectorData: true,
            loadingProgrammes: true,
            loadingSectors: true,
            loadingIndicators: true,
            loadingGeoJson: false,
            geoJson: undefined,
            geoJsonIdKey: 'id',
            geoJsonLabelKey: 'label',
        };

        this.defaultHash = 'province';

        this.routes = {
            province: 'Province Details',
            programme: 'Programme Details',
            sector: 'Sector Details',
        };

        this.views = {
            province: {
                component: () => (
                        <ProvinceDetailInfo
                            loading={this.state.loadingProvinceData}
                        />
                    ),
            },

            programme: {
                component: () => (
                    <ProgrammeDetails
                        loading={this.state.loadingProgrammeData}
                    />
                ),
            },

            sector: {
                component: () => (
                    <SectorDetailInfo
                        loading={this.state.loadingSectorData}
                    />
                ),
            },
        };

        this.geoJsons = {};
    }

    componentDidMount() {
        this.startRequestForProvinceData();
        this.startRequestForProvinces();
        this.reloadGeoJson();
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

    setGeoJsons = (url: string, geoJsons: GeoJSON) => {
        this.geoJsons[url] = geoJsons;
    }

    handleFilterChange = (oldValues: DashboardFilterParams, values: DashboardFilterParams) => {
        const { provinceId, programmeId, sectorId } = values;
        if (provinceId && oldValues.provinceId !== provinceId) {
            this.handleProvinceChange(provinceId);
        }
        if (programmeId && oldValues.programmeId !== values.programmeId) {
            window.location.hash = '#/programme';
        }
        if (sectorId && oldValues.sectorId !== values.sectorId) {
            window.location.hash = '#/sector';
        }
    }

    handleProvinceChange = (key: number) => {
        window.location.hash = '#/province';
        this.setState(
            {
                loadingGeoJson: true,
            },
            this.reloadGeoJson,
        );
    }

    reloadGeoJson = () => {
        const { selectedProvince } = this.props;

        if (this.geoJsonRequest) {
            this.geoJsonRequest.stop();
        }

        let url: string;
        let idKey: string;
        let labelKey: string;

        if (!selectedProvince.id) {
            url = urlForCountryGeoJson;
            idKey = 'Province';
            labelKey = 'Province';
        } else {
            url = createUrlForProvinceGeoJson(selectedProvince.id);
            idKey = 'FIRST_DCOD';
            labelKey = 'FIRST_DIST';
        }

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
    }

    handleMapClick = (key: string) => {
        const { selectedProvince } = this.props;
        if (!selectedProvince.id) {
            this.handleProvinceChange(parseInt(key, 10));
        }
    }

    renderSectorDetailInfo = () => (
        <div className={styles.message}>
            <h3> Data Not Available</h3>
        </div>
    )

    renderInformation = () => {
        const {
            selectedProvince,
            selectedProgramme,
            selectedSector,
        } = this.props;

        const showCountryDetails = !(
            selectedProgramme.id || selectedProvince.id || selectedSector.id
        );

        if (showCountryDetails) {
            return (
                <CountryDetails />
            );
        }

        return (
            <div className={styles.details} >
                <FixedTabs
                    className={styles.tabs}
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
            selectedProvince,
            selectedProgramme,
            selectedSector,
        } = this.props;

        const {
            geoJson,
            geoJsonLabelKey,
            geoJsonIdKey,
            loadingProvinceData,
            loadingProgrammeData,
            // loadingSectorData,
            loadingProvinces,
            loadingProgrammes,
            loadingSectors,
            loadingIndicators,
            loadingGeoJson,
        } = this.state;

        const loading = (
            loadingProvinceData || loadingProgrammeData ||  loadingGeoJson ||
            loadingProvinces || loadingProgrammes || loadingSectors ||
            loadingIndicators // || loadingSectorData
        );

        return (
            <div className={styles.dashboard}>
                <div className={styles.left}>
                    <div className={styles.mapContainer}>
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
                        />

                        <div className={styles.overlay}>
                            { selectedProvince.id &&
                                <span className={styles.provinceName}>
                                    {selectedProvince.name}
                                </span>
                            }
                            { selectedProgramme.id &&
                                    <span className={styles.programName}>
                                    {selectedProgramme.name}
                                    </span>
                            }
                            { selectedSector.id &&
                                    <span className={styles.sectorName}>
                                    {selectedSector.name}
                                    </span>
                            }
                        </div>
                    </div>
                </div>
                <div className={styles.right}>
                    <Information />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    selectedProvince: dashboardProvinceSelector(state),
    selectedProgramme: dashboardProgrammeSelector(state),
    selectedProgrammeData: dashboardProgrammeDataSelector(state),
    selectedSector: dashboardSectorSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setProvinces: (params: SetProvincesAction) => dispatch(setProvincesAction(params)),
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
