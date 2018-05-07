import React from 'react';
import {
    RouteComponentProps,
} from 'react-router-dom';

import SelectInput from '../../vendor/react-store/components/Input/SelectInput';
import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';
import { RestRequest, FgRestBuilder } from '../../vendor/react-store/utils/rest';

import {
    urlForProvinceData,
    createParamsForProvinceData,
    urlForProvinces,
    createParamsForProvinces,
    createUrlForProvinceGeoJson,
    urlForCountryGeoJson,

    urlForProgrammes,
    createParamsForProgrammes,
} from '../../rest';
import schema from '../../schema';
import Map, { GeoJSON } from '../../components/Map';

import styles from './styles.scss';

interface Props extends RouteComponentProps<{}> {
}

interface ProgrammeName {
    id: number;
    programName: string;
}

interface ProvinceData {
    id: number;
    province: string;
    district: number;
    totalPopulation: number;
    area: number;
    populationDensity: number;
    povertyRate: number;
    populationUnderPovertyLine: number;
    perCapitaIncome: number;
    hhByLowestWealthQuantiles: number;
    humanDevelopmentIndex: number;
    minuteAccessTo: number;
    vulnerabilityIndex: number;
    gdp: number;
    activeProgrammes: ProgrammeName[];
    totalBudget: number;
}

interface Province {
    id: number;
    name: string;
}

interface Programme {
    id: number;
    name: string;
}

interface State {
    selectedProvince?: number;
    selectedProgramme?: number;
    provinceData?: ProvinceData[];
    provinces?: Province[];
    programmes?: Programme[];
    loadingProvinceData: boolean;
    loadingProvinces: boolean;
    loadingProgrammes: boolean;
    loadingGeoJson: boolean;
    geoJson?: GeoJSON;
    geoJsonIdKey: string;
    geoJsonLabelKey: string;
}

interface Option {
    key: number;
    label: string;
}

const noOp = () => {};

export default class Dashboard extends React.PureComponent<Props, State>{
    provinceOptions: Option[];
    projectOptions: Option[];
    sectorOptions: Option[];
    indicatorOptions: Option[];
    defaultData: object;
    provinceDataRequest: RestRequest;
    provincesRequest: RestRequest;
    programmeRequest: RestRequest;
    geoJsonRequest: RestRequest;
    geoJsons: {
        [key: string]: GeoJSON,
    };

    static provinceKeyExtractor = (p: Province) => p.id;
    static provinceLabelExtractor = (p: Province) => p.name;

    static programmeKeyExtractor = (p: Programme) => p.id;
    static programmeLabelExtractor = (p: Programme) => p.name;


    constructor(props: Props) {
        super(props);

        this.defaultData = {};
        this.state = {
            selectedProvince: props.location.state
                ? props.location.state.provinceId
                : undefined,
            provinces: [],
            selectedProgramme: undefined,
            programmes: [],
            loadingProvinceData: true,
            loadingProvinces: true,
            loadingProgrammes: true,
            loadingGeoJson: false,
            geoJson: undefined,
            geoJsonIdKey: 'id',
            geoJsonLabelKey: 'label',
        };

        this.provinceOptions = [
            { key: 1, label: 'Province 1' },
            { key: 2, label: 'Province 2' },
            { key: 3, label: 'Province 3' },
        ];

        this.projectOptions = [
            { key: 1, label: 'Project 1' },
            { key: 2, label: 'Project 2' },
        ];

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
        this.provinceDataRequest = new FgRestBuilder()
            .url(urlForProvinceData)
            .params(createParamsForProvinceData)
            .preLoad(() => this.setState({ loadingProvinceData: true }))
            .postLoad(() => this.setState({ loadingProvinceData: false }))
            .success((response: ProvinceData[]) => {
                try {
                    schema.validate(response, 'array.provinceData');
                    this.setState({ provinceData: response });
                } catch (error) {
                    console.warn(error);
                }
            })
            .build();

        this.provinceDataRequest.start();

        this.provincesRequest = new FgRestBuilder()
            .url(urlForProvinces)
            .params(createParamsForProvinces)
            .preLoad(() => this.setState({ loadingProvinces: true }))
            .postLoad(() => this.setState({ loadingProvinces: false }))
            .success((response: Province[]) => {
                try {
                    schema.validate(response, 'array.province');
                    this.setState({ provinces: response });
                } catch (error) {
                    console.warn(error);
                }
            })
            .build();

        this.provincesRequest.start();

        this.reloadGeoJson();


        this.programmeRequest = new FgRestBuilder()
            .url(urlForProgrammes)
            .params(createParamsForProgrammes)
            .preLoad(() => this.setState({ loadingProgrammes: true }))
            .postLoad(() => this.setState({ loadingProgrammes: false }))
            .success((response: Programme[]) => {
                try {
                    schema.validate(response, 'array.province');
                    this.setState({ programmes: response });
                } catch (error) {
                    console.warn(error);
                }
            })
            .build();

        this.programmeRequest.start();


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
        if (this.geoJsonRequest) {
            this.geoJsonRequest.stop();
        }
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
        this.setState(
            {
                selectedProgramme: key,
            },
        );

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

    renderFilters = () => (
        <div className={styles.filters}>
            <div className={styles.left}>
                { !this.state.loadingProvinces &&
                    <SelectInput
                        label="Province"
                        className={styles.filter}
                        value={this.state.selectedProvince}
                        options={this.state.provinces}
                        keySelector={Dashboard.provinceKeyExtractor}
                        labelSelector={Dashboard.provinceLabelExtractor}
                        showHintAndError={false}
                        onChange={this.handleProvinceChange}
                    />
                }
                <SelectInput
                    label="Project"
                    className={styles.filter}
                    options={this.state.programmes}
                    value={this.state.selectedProgramme}
                    keySelector={Dashboard.programmeKeyExtractor}
                    labelSelector={Dashboard.programmeLabelExtractor}
                    showHintAndError={false}
                    onChange={this.handleProgrammeChange}
 
                />
                <SelectInput
                    label="Sector"
                    className={styles.filter}
                    options={this.sectorOptions}
                    showHintAndError={false}
                    onChange={noOp}
                />
            </div>
            <div className={styles.right}>
                <SelectInput
                    label="Indicator"
                    className={styles.filter}
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
                        {data.totalPopulation || '-'} </div>
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

    renderInformation = () => {
        const {
            selectedProvince,
            loadingProvinceData,
        } = this.state;

        // tslint:disable-next-line variable-name
        const ProvinceDetailInfo = this.renderProvinceDetailInfo;

        return (
            <div className={styles.right}>
                { selectedProvince &&
                    <div className={styles.provinceDetails}>
                        <h3 className={styles.title}>
                            Province details
                        </h3>
                        { loadingProvinceData &&
                            <div className={styles.content}>
                                Loading Province Information ...
                            </div>
                        }
                        {
                            !loadingProvinceData &&
                            <ProvinceDetailInfo />
                        }
                    </div>
                }

                <div className={styles.projectDetails}>
                    <h3 className={styles.title}>
                        Project details
                    </h3>
                    <div className={styles.content}>
                        Project details
                    </div>
                </div>
            </div>
        );
    }

    render() {
        // tslint:disable-next-line variable-name
        const Filters = this.renderFilters;

        // tslint:disable-next-line variable-name
        const Information = this.renderInformation;

        return (
            <div className={styles.dashboard}>
                <div className={styles.left}>
                    <Filters />
                    <div className={styles.mapContainer}>
                        {this.state.loadingGeoJson && <LoadingAnimation />}
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
