import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { iconNames } from '../../constants';
import SelectInput from '../../vendor/react-store/components/Input/SelectInput';
import PrimaryButton from '../../vendor/react-store/components/Action/Button/PrimaryButton';
import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';
import FixedTabs from '../../vendor/react-store/components/View/FixedTabs';
import MultiViewContainer from '../../vendor/react-store/components/View/MultiViewContainer';
import { RestRequest, FgRestBuilder } from '../../vendor/react-store/utils/rest';

import {
    createParamsForProvinces,
    createUrlForProvinceGeoJson,
    urlForCountryGeoJson,
} from '../../rest';

import {
    ProvinceData,
    ProgrammeData,
    Province,
    Programme,
} from '../../redux/interface';
import CountryDetails from '../Dashboard/CountryDetails';

import Map, { GeoJSON } from '../../components/Map';

import ProvinceDataGetRequest from './requests/ProvinceDataGetRequest';
import ProvincesGetRequest from './requests/ProvincesGetRequest';
import ProgrammesGetRequest from './requests/ProgrammesGetRequest';
import ProgrammesDataRequest from './requests/ProgrammesDataRequest';

import styles from './styles.scss';

interface Props extends RouteComponentProps<{}> {}

interface State {
    selectedProvince?: number;
    selectedProgramme?: number;
    provinceData?: ProvinceData[];
    programmeData?: ProgrammeData[];
    provinces?: Province[];
    programmes?: Programme[];
    loadingProvinceData: boolean;
    loadingProgrammeData: boolean;
    loadingProvinces: boolean;
    loadingProgrammes: boolean;
    loadingGeoJson: boolean;
    geoJson?: GeoJSON;
    geoJsonIdKey: string;
    geoJsonLabelKey: string;

    isHidden: boolean;
}

interface Option {
    key: number;
    label: string;
}

interface Routes {
    province: string;
    programme: string;
    sector: string;
}

interface DefaultHash {
    province: string;
}

interface Views {
    province: object;
    programme: object;
}
const noOp = () => {};

export class Dashboard extends React.PureComponent<Props, State>{
    sectorOptions: Option[];
    indicatorOptions: Option[];
    provinceDataRequest: RestRequest;
    provincesRequest: RestRequest;
    programmeRequest: RestRequest;
    programmeDataRequest: RestRequest;
    geoJsonRequest: RestRequest;
    geoJsons: {
        [key: string]: GeoJSON,
    };

    routes: Routes;
    defaultHash: DefaultHash;
    views: Views;

    static provinceKeyExtractor = (p: Province) => p.id;
    static provinceLabelExtractor = (p: Province) => p.name;

    static programmeKeyExtractor = (p: Programme) => p.id;
    static programmeLabelExtractor = (p: Programme) => p.name;


    constructor(props: Props) {
        super(props);

        this.state = {
            selectedProvince: props.location.state
                ? props.location.state.provinceId
                : undefined,
            provinces: [],
            selectedProgramme: undefined,
            programmes: [],
            loadingProvinceData: true,
            loadingProgrammeData: true,
            loadingProvinces: true,
            loadingProgrammes: true,
            loadingGeoJson: false,
            geoJson: undefined,
            geoJsonIdKey: 'id',
            geoJsonLabelKey: 'label',

            isHidden: true,
        };

        this.routes = {
            province: 'Province Details',
            programme: 'Programme Details',
            sector: 'Sector Details',
        };

        this.views = {
            province: {
                component: () => {
                    const {
                        selectedProvince,
                        loadingProvinceData,
                    } = this.state;

                    if (!selectedProvince) {
                        return <div />;
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
                    const {
                        selectedProgramme,
                        loadingProgrammeData,
                    } = this.state;

                    if (!selectedProgramme) {
                        return <div />;
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


        };


        this.sectorOptions = [
            { key: 1, label: 'Sector 1' },
            { key: 2, label: 'Sector 2' },
        ];

        this.indicatorOptions = [
            { key: 1, label: 'HDI' },
            { key: 2, label: 'Population density' },
        ];

        this.geoJsons = {};
    }

    componentDidMount() {
        this.startRequestForProvinceData();
        this.startRequestForProvinces();
        this.reloadGeoJson();
        this.startRequestForProgrammes();
        this.startRequestForProgrammesData();
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
    }

    startRequestForProvinceData = () => {
        if (this.provinceDataRequest) {
            this.provinceDataRequest.stop();
        }
        const provinceDataRequest = new ProvinceDataGetRequest({
            setState: params => this.setState(params),
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
        });
        this.programmeDataRequest = programmeDataRequest.create();
        this.programmeDataRequest.start();
    }

    handleProvinceChange = (key: number) => {
        this.setState(
            {
                selectedProvince: key,
                loadingGeoJson: true,
            },
            this.reloadGeoJson,
        );
    }

    handleProgrammeChange = (key: number) => {
        this.setState({ selectedProgramme: key });
    }

    reloadGeoJson = () => {
        const { selectedProvince } = this.state;

        if (this.geoJsonRequest) {
            this.geoJsonRequest.stop();
        }

        let url: string;
        let idKey: string;
        let labelKey: string;

        if (!selectedProvince) {
            url = urlForCountryGeoJson;
            idKey = 'Province';
            labelKey = 'Province';
        } else {
            url = createUrlForProvinceGeoJson(selectedProvince);
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

    toggleHidden = () => {
        this.setState({
            isHidden: !this.state.isHidden,
        });
    }

    renderPopup = () => (
        <div className={styles.popup}>
        <PrimaryButton
                    title="Expand"
                    onClick={this.toggleHidden}
                    iconName={iconNames.expand}
        />

        </div>
    )

    renderFilters = () => (
        <div className={styles.filters}>
            <div className={styles.title}>
                <h3>
                    filters
                </h3>
                <PrimaryButton
                    title="Close"
                    onClick={this.toggleHidden}
                    iconName={iconNames.close}
                    className={styles.close}
                    transparent
                />
            </div>
            <div className={styles.left}>
                { !this.state.loadingProvinces &&
                    <SelectInput
                        label="Province"
                        className={styles.province}
                        value={this.state.selectedProvince}
                        options={this.state.provinces}
                        keySelector={Dashboard.provinceKeyExtractor}
                        labelSelector={Dashboard.provinceLabelExtractor}
                        showHintAndError={false}
                        onChange={this.handleProvinceChange}
                    />
                }
                <SelectInput
                    label="Programme"
                    className={styles.programme}
                    options={this.state.programmes}
                    value={this.state.selectedProgramme}
                    keySelector={Dashboard.programmeKeyExtractor}
                    labelSelector={Dashboard.programmeLabelExtractor}
                    showHintAndError={false}
                    onChange={this.handleProgrammeChange}
 
                />
                <SelectInput
                    label="Sector"
                    className={styles.sector}
                    options={this.sectorOptions}
                    showHintAndError={false}
                    onChange={noOp}
                />
            </div>
            <div className={styles.title}>
                <h3>
                    Sub-filters
                </h3>
            </div>
            <div className={styles.right}>
                <SelectInput
                    label="Indicator"
                    className={styles.indicator}
                    options={this.indicatorOptions}
                    showHintAndError={false}
                    onChange={noOp}
                />
                <SelectInput
                    label="Map Layers"
                    className={styles.layers}
                    options={this.indicatorOptions}
                    showHintAndError={false}
                    onChange={noOp}
                />

            </div>
        </div>
    )

    renderProvinceDetailInfo = () => {
        const {
            provinceData = [],
            selectedProvince,
        } = this.state;

        const data: Partial<ProvinceData> = provinceData.find(d =>
            d.id === selectedProvince,
        ) || {};

        const programmeNames = (data.activeProgrammes || []).map(programme => (
            programme.programName
        )).join(', ');

        return (
            <div
                className={styles.content}
            >
                <div
                    className={styles.item}
                    key="totalPopulation"
                >
                    <div className={styles.label}>
                        Total population
                    </div>
                    <div className={styles.value}>
                        {data.totalPopulation || '-'} </div>
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
                    <div className={styles.value}>
                        {data.area || '-'}
                    </div>
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
                    <div className={styles.value}>
                        {data.populationUnderPovertyLine || '-'}
                    </div>
                </div>
                <div
                    className={styles.item}
                    key="perCapitaIncome"
                >
                    <div className={styles.label}>
                        Per Capita Income
                    </div>
                    <div className={styles.value}>
                        {data.perCapitaIncome || '-'}
                    </div>
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
                    <div className={styles.value}>
                        {data.gdp || '-'}
                    </div>
                </div>
                <div
                    className={styles.item}
                    key="programmeName"
                >
                    <div className={styles.label}>
                        Active Programmes
                    </div>
                    <div className={styles.value}>
                        {programmeNames || '-'}
                    </div>
                </div>
                <div
                    className={styles.item}
                    key="totalBudget"
                >
                    <div className={styles.label}>
                        Total Budget
                    </div>
                    <div className={styles.value}>
                        {data.totalBudget || '-'}
                    </div>
                </div>
            </div>
        );
    }

    renderProgrammeDetailInfo = () => {
        const {
            programmeData = [],
            selectedProgramme,
        } = this.state;

        const data: Partial<ProgrammeData> = programmeData.find(d =>
            d.programId === selectedProgramme,
        ) || {};

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
                    <div className={styles.value}>
                        {data.programBudget || '-'} </div>
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

    renderInformation = () => {
        const {
            selectedProgramme,
            selectedProvince,
        } = this.state;


        return (
            <div className={styles.right}>
                { (selectedProgramme || selectedProvince)  ?
                <div>
                 <FixedTabs
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
        const Filters = this.renderFilters;

         // tslint:disable-next-line variable-name
        const Popup = this.renderPopup;

        // tslint:disable-next-line variable-name
        const Information = this.renderInformation;

        return (
            <div className={styles.dashboard}>
                <div className={styles.left}>
                    <div className={styles.mapContainer}>
                        {this.state.loadingGeoJson && <LoadingAnimation />}
                        { this.state.isHidden &&
                        <Popup />
                        }
                        { !this.state.isHidden &&
                        <Filters />
                        }
                        <Map
                            className={styles.map}
                            geojson={this.state.geoJson}
                            idKey={this.state.geoJsonIdKey}
                            labelKey={this.state.geoJsonLabelKey}
                        />
                    </div>
                </div>
                <Information />
            </div>
        );
    }
}

export default Dashboard;
