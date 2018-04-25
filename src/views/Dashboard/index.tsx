import React from 'react';
import {
    RouteComponentProps,
} from 'react-router-dom';

import SelectInput from '../../vendor/react-store/components/Input/SelectInput';
import { RestRequest, FgRestBuilder } from '../../vendor/react-store/utils/rest';

import {
    urlForProvinceData,
    createParamsForProvinceData,
    urlForProvinces,
    createParamsForProvinces,
} from '../../rest';
import schema from '../../schema';
import Map from '../../components/Map';
import provinceGeoJson from '../../geofiles/province.geo.json';

import styles from './styles.scss';

interface Props extends RouteComponentProps<{}> {
}

interface ProvinceData {
    id: number;
    province: string;
    total_population: number;
    area: number;
    population_density: number;
    poverty_rate: number;
    population_under_poverty_line: number;
    per_capita_income: number;
    hh_by_lowest_wealth_quantiles: number;
    human_development_index: number;
    minute_access_to: number;
    vulnerability_index: number;
    gdp: number;
}
interface Province {
    id: number;
    name: string;
}

interface State {
    selectedProvince?: number;
    provinceData?: ProvinceData[];
    provinces?: Province[];
    loadingProvinceData: boolean;
    loadingProvinces: boolean;
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
    provinceDataRequest: RestRequest;
    provincesRequest: RestRequest;

    static provinceKeyExtractor = (p: Province) => p.id;
    static provinceLabelExtractor = (p: Province) => p.name;

    constructor(props: Props) {
        super(props);

        this.state = {
            selectedProvince: props.location.state
                ? props.location.state.provinceId
                : undefined,
            provinces: [],
            loadingProvinceData: true,
            loadingProvinces: true,
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
    }

    componentWillUnmount() {
        if (this.provinceDataRequest) {
            this.provinceDataRequest.stop();
        }
        if (this.provincesRequest) {
            this.provincesRequest.stop();
        }
    }

    handleProvinceChange = (key: number) => {
        this.setState({ selectedProvince: key });
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
                    options={this.projectOptions}
                    showHintAndError={false}
                    onChange={noOp}
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

    renderInformation = () => {
        const provinceData = this.state.provinceData && this.state.selectedProvince
            ? this.state.provinceData.find(d => d.id === this.state.selectedProvince)
            : undefined;

        return (
            <div className={styles.right}>
                { this.state.selectedProvince &&
                    <div className={styles.provinceDetails}>
                        <h3 className={styles.title}>
                            Province details
                        </h3>
                        { this.state.loadingProvinceData &&
                            <div className={styles.content}>
                                Loading Province Information ...
                            </div>
                        }
                        { provinceData && !this.state.loadingProvinceData &&
                            <div className={styles.content}>
                                <p>
                                    {provinceData.province}
                                </p>
                                <p>
                                    Total population:
                                    {provinceData.total_population}
                                </p>
                                <p>
                                    Area:
                                    {provinceData.area}
                                </p>
                                <p>
                                    Population Density:
                                    {provinceData.population_density}
                                </p>
                                <p>
                                    Poverty Rate:
                                    {provinceData.poverty_rate}
                                </p>
                                <p> Population under poverty line:
                                    {provinceData.population_under_poverty_line}
                                </p>
                                <p>
                                    Per capita income:
                                    {provinceData.per_capita_income}
                                </p>
                                <p>
                                    HH by lowest wealth quantiles:
                                    {provinceData.hh_by_lowest_wealth_quantiles}
                                </p>
                                <p>
                                    HDI:
                                    {provinceData.human_development_index}
                                </p>
                                <p>
                                    Minute access to:
                                    {provinceData.minute_access_to}
                                </p>
                                <p>
                                    Vulnerability index:
                                    {provinceData.vulnerability_index}
                                </p>
                                <p>
                                    GDP:
                                    {provinceData.gdp}
                                </p>
                            </div>
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
                    <Map
                        className={styles.map}
                        geojson={provinceGeoJson}
                        idKey="D_ID"
                        labelKey="Title"
                    />
                </div>
                <Information />
            </div>
        );
    }
}
