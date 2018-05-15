import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';
import Numeral from '../../vendor/react-store/components/View/Numeral';
import ListView from '../../vendor/react-store/components/View/List/ListView';
import FixedTabs from '../../vendor/react-store/components/View/FixedTabs';
import MultiViewContainer from '../../vendor/react-store/components/View/MultiViewContainer';
import { RestRequest, FgRestBuilder } from '../../vendor/react-store/utils/rest';
import schema from '../../schema';

import {
    createParamsForProvinces,
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
    dashboardProvinceDataSelector,
    dashboardProgrammeDataSelector,
} from '../../redux';

import {
    RootState,
    ProvinceData,
    ProgrammeData,
    ProgrammeName,
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

import CountryDetails from '../Dashboard/CountryDetails';
import Filter from './Filter';

import Map, { GeoJSON } from '../../components/Map';

import ProvinceDataGetRequest from './requests/ProvinceDataGetRequest';
import ProvincesGetRequest from './requests/ProvincesGetRequest';
import ProgrammesGetRequest from './requests/ProgrammesGetRequest';
import SectorsGetRequest from './requests/SectorsGetRequest';
import ProgrammesDataRequest from './requests/ProgrammesDataRequest';

import styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    selectedProvince: Province;
    selectedProvinceData: ProvinceData;
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
                component: () => {
                    const { selectedProvince } = this.props;
                    const { loadingProvinceData } = this.state;

                    if (!selectedProvince.id) {
                        return (
                            <div className={styles.message}>
                                <h3> Select a province </h3>
                            </div>
                        );
                    }

                    // tslint:disable-next-line variable-name
                    const ProvinceDetailInfo = this.renderProvinceDetailInfo;
                    // tslint:disable-next-line variable-name
                    const LoadingMessage = () => (
                        <div className={styles.content}>
                            Loading Province Information ...
                        </div>
                    );


                    return (
                        <div className={styles.provinceDetails}>
                            {
                                loadingProvinceData ?
                                    <LoadingMessage /> :
                                    <ProvinceDetailInfo />
                            }
                        </div>
                    );
                },
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

        this.geoJsonRequest = this.createGeoJsonRequest(url, idKey, labelKey);
        this.geoJsonRequest.start();
    }

    createGeoJsonRequest = (url: string, geoJsonIdKey: string, geoJsonLabelKey: string) => {
        const request = new FgRestBuilder()
            .url(url)
            .params(createParamsForProvinces)
            .preLoad(() => this.setState({ loadingGeoJson: true }))
            .postLoad(() => this.setState({ loadingGeoJson: false }))
            .success((response: GeoJSON) => {
                schema.validate(response, 'countryGeoJson');
                this.geoJsons[url] = response;
                // Convert ids to strings to make things simpler later
                response.features.forEach((acc: any) => {
                    acc.properties[geoJsonIdKey] = `${acc.properties[geoJsonIdKey]}`;
                });
                this.setState({
                    geoJsonIdKey,
                    geoJsonLabelKey,
                    geoJson: response,
                    loadingGeoJson: false,
                });
            })
            .build();
        return request;
    }

    handleMapClick = (key: string) => {
        const { selectedProvince } = this.props;
        if (!selectedProvince.id) {
            this.handleProvinceChange(parseInt(key, 10));
        }
    }

    renderProvinceDetailInfo = () => {
        const { selectedProvinceData: data } = this.props;
        const { activeProgrammes = [] } = data;

        return (
            <div
                className={styles.content}
            >
                <div
                    className={styles.item}
                    key="province"
                >
                    <div className={styles.label}>
                        Province
                    </div>
                    <div className={styles.value}>
                        {data.province || '-'} </div>
                </div>
                <div
                    className={styles.item}
                    key="totalPopulation"
                >
                    <div className={styles.label}>
                        Total population
                    </div>
                    <Numeral
                        className={styles.value}
                        precision={0}
                        value={data.totalPopulation}
                    />
                </div>
                <div
                    className={styles.item}
                    key="district"
                >
                    <div className={styles.label}>
                       No. of Districts
                    </div>
                    <div className={styles.value}>
                        {data.district || '-'} </div>
                </div>
                <div
                    className={styles.item}
                    key="area"
                >
                    <div className={styles.label}>
                        Area (sq.km)
                    </div>
                    <Numeral
                        className={styles.value}
                        precision={0}
                        value={data.area}
                    />
                </div>
                <div
                    className={styles.item}
                    key="populationDensity"
                >
                    <div className={styles.label}>
                        Population Density
                    </div>
                    <div className={styles.value}>
                        {data.populationDensity || '-'}
                    </div>
                </div>
                <div
                    className={styles.item}
                    key="povertyRate"
                >
                    <div className={styles.label}>
                        Poverty Rate
                    </div>
                    <div className={styles.value}>
                        {data.povertyRate || '-'}
                    </div>
                </div>
                <div
                    className={styles.item}
                    key="populationUnderPovertyLine"
                >
                    <div className={styles.label}>
                        Population Under Poverty
                    </div>
                    <Numeral
                        className={styles.value}
                        precision={0}
                        value={data.populationUnderPovertyLine}
                    />
                </div>
                <div
                    className={styles.item}
                    key="perCapitaIncome"
                >
                    <div className={styles.label}>
                        Per Capita Income
                    </div>
                    <Numeral
                        className={styles.value}
                        precision={0}
                        prefix="$"
                        value={data.perCapitaIncome}
                    />
                </div>
                <div
                    className={styles.item}
                    key="hhByLowestWealthQuantiles"
                >
                    <div className={styles.label}>
                        HH By Lowest Wealth Quantiles
                    </div>
                    <div className={styles.value}>
                        {data.hhByLowestWealthQuantiles || '-'}
                    </div>
                </div>
                <div
                    className={styles.item}
                    key="humanDevelopmentIndex"
                >
                    <div className={styles.label}>
                        HDI
                    </div>
                    <div className={styles.value}>
                        {data.humanDevelopmentIndex || '-'}
                    </div>
                </div>
                <div
                    className={styles.item}
                    key="minuteAccessTo"
                >
                    <div className={styles.label}>
                        Minute Access To
                    </div>
                    <div className={styles.value}>
                        {data.minuteAccessTo || '-'}
                    </div>
                </div>
                <div
                    className={styles.item}
                    key="vulnerabilityIndex"
                >
                    <div className={styles.label}>
                        Vulnerability Index
                    </div>
                    <div className={styles.value}>
                        {data.vulnerabilityIndex || '-'}
                    </div>
                </div>
                <div
                    className={styles.item}
                    key="gdp"
                >
                    <div className={styles.label}>
                        GDP
                    </div>
                    <Numeral
                        className={styles.value}
                        precision={0}
                        prefix="$"
                        value={data.gdp}
                    />
                </div>
                <div
                    className={styles.item}
                    key="programmeName"
                >
                    <div className={styles.label}>
                        Active Programmes
                    </div>
                    <ListView
                        className={`${styles.value} ${styles.programme}`}
                        data={activeProgrammes}
                        modifier={this.renderProgrammeName}
                    />
                </div>
                <div
                    className={styles.item}
                    key="totalBudget"
                >
                    <div className={styles.label}>
                        Total Budget
                    </div>
                    <Numeral
                        className={styles.value}
                        precision={0}
                        prefix="£"
                        value={data.totalBudget}
                    />
                </div>
            </div>
        );
    }

    renderProgrammeName = (k: undefined, data: ProgrammeName) => (
        <div
            key={data.programID}
            className={styles.programmeName}
        >
            <span className={styles.marker}>•</span>
            <span className={styles.title}>{data.programName}</span>
        </div>
    )

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
                    <div className={styles.value}>
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
                        className={styles.value}
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
                    <div className={styles.value}>
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
    selectedProvinceData: dashboardProvinceDataSelector(state),
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
