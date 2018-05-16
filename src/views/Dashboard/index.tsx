import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';
import Numeral from '../../vendor/react-store/components/View/Numeral';
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
    DashboardFilterParams,
} from '../../redux/interface';

import Map, { GeoJSON } from '../../components/Map';

import CountryDetails from '../Dashboard/CountryDetails';
import Filter from './Filter';
import ProvinceDetailInfo from './ProvinceDetailInfo';

import ProvinceDataGetRequest from './requests/ProvinceDataGetRequest';
import ProvincesGetRequest from './requests/ProvincesGetRequest';
import ProgrammesGetRequest from './requests/ProgrammesGetRequest';
import SectorsGetRequest from './requests/SectorsGetRequest';
import ProgrammesDataRequest from './requests/ProgrammesDataRequest';
import CountryGeoJsonGetRequest from './requests/CountryGeoJsonGetRequest';

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
                component: () => {
                    const { selectedProgramme } = this.props;
                    const { loadingProgrammeData } = this.state;

                    if (!selectedProgramme.id) {
                        return (
                            <div className={styles.message}>
                                <h3> Select a programme </h3>
                            </div>
                        );
                    }

                    // tslint:disable-next-line variable-name
                    const ProgrammeDetailInfo = this.renderProgrammeDetailInfo;
                    // tslint:disable-next-line variable-name
                    const LoadingMessage = () => (
                        <div className={styles.content}>
                            Loading Province Information ...
                        </div>
                    );


                    return (
                        <div className={styles.programmeDetails}>
                            {
                                loadingProgrammeData ?
                                    <LoadingMessage /> :
                                    <ProgrammeDetailInfo />
                            }
                        </div>
                    );
                },
            },

            sector: {
                component: () => {
                    const { selectedSector } = this.props;

                    if (!selectedSector.id) {
                        return (
                            <div className={styles.message}>
                                <h3> Select a sector </h3>
                            </div>
                        );
                    }

                    // tslint:disable-next-line variable-name
                    const SectorDetailInfo = this.renderSectorDetailInfo;

                    return (
                        <div className={styles.sectorDetails}>
                            <SectorDetailInfo />
                        </div>
                    );
                },
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
        const programmeDataRequest = new ProgrammesDataRequest({
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

    renderProgrammeDetailInfo = () => {
        const { selectedProgrammeData: data } = this.props;

        return (
            <div
                className={styles.content}
            >
                <div
                    className={styles.item}
                    key="program"
                >
                    <div className={styles.label}>
                        Program
                    </div>
                    <div className={styles.data}>
                        {data.program || '-'} </div>
                </div>
                <div
                    className={styles.item}
                    key="programBudget"
                >
                    <div className={styles.label}>
                       Budget
                    </div>
                    <Numeral
                        className={styles.data}
                        prefix="£"
                        precision={0}
                        value={data.programBudget}
                    />
                </div>
                <div
                    className={styles.item}
                    key="description"
                >
                    <div className={styles.label}>
                       Description
                    </div>
                    <div className={styles.data}>
                        {data.description || '-'}
                    </div>
                </div>
            </div>
        );
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

        return (
            <div className={styles.right}>
                { (selectedProgramme.id || selectedProvince.id || selectedSector.id)  ?
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
                :
                    <CountryDetails />
                }
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
            loadingGeoJson,
        } = this.state;

        return (
            <div className={styles.dashboard}>
                <div className={styles.left}>
                    <div className={styles.mapContainer}>
                        {loadingGeoJson && <LoadingAnimation />}
                        <Filter
                            disabled={loadingGeoJson}
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
                <Information />
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
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Dashboard);
