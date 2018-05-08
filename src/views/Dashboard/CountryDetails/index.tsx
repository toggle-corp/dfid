import React from 'react';

import { RestRequest, FgRestBuilder } from '../../../vendor/react-store/utils/rest';

import {
    urlForCountryData,
    createParamsForCountryData,
} from '../../../rest';

import schema from '../../../schema';

import * as styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {}
type Props = OwnProps & PropsFromState;

interface CountryData {
    id: number;
    provinces: number;
    paalikas: number;
    municipalities: number;
    totalPopulation: number;
    area: number;
    populationDensity: number;
    povertyRate: number;
    literacyRate: number;
    populationUnderPovertyLine: number;
    perCapitaIncome: number;
    humanDevelopmentIndex: number;
    gdp: number;
}

interface State {
    countryData?: CountryData;
    loadingCountryData: boolean;
}

export default class CountryDetails extends React.PureComponent<Props, State>{
    countryDataRequest: RestRequest;

    constructor(props: Props) {
        super(props);

        this.state = {
            loadingCountryData: true,
        };
    }

    componentDidMount() {
        this.countryDataRequest = new FgRestBuilder()
            .url(urlForCountryData)
            .params(createParamsForCountryData)
            .preLoad(() => this.setState({ loadingCountryData: true }))
            .postLoad(() => this.setState({ loadingCountryData: false }))
            .success((response: CountryData[]) => {
                try {
                    schema.validate(response, 'array.countryData');
                    this.setState({ countryData: response[0] });
                } catch (error) {
                    console.warn(error);
                }
            })
            .build();
        this.countryDataRequest.start();
    }

    componentWillUnmount() {
        if (this.countryDataRequest) {
            this.countryDataRequest.stop();
        }
    }

    renderCountryDetailInfo = () => {
        const countryData: Partial<CountryData> = this.state.countryData || {};
        const data = countryData;

        return (
            <div
                className={styles.content}
            >
                <div
                    className={styles.item}
                    key="provinces"
                >
                    <div className={styles.label}>
                        Provinces
                    </div>
                    <div className={styles.value}>
                        {data.provinces || '-'} </div>
                </div>
                <div
                    className={styles.item}
                    key="municipalities"
                >
                    <div className={styles.label}>
                       Municipalities
                    </div>
                    <div className={styles.value}>
                        {data.municipalities || '-'} </div>
                </div>
                <div
                    className={styles.item}
                    key="paalikas"
                >
                    <div className={styles.label}>
                       Paalikas
                    </div>
                    <div className={styles.value}>
                        {data.paalikas || '-'} </div>
                </div>
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
                    key="literacyRate"
                >
                    <div className={styles.label}>
                        Literacy Rate
                    </div>
                    <div className={styles.value}>
                        {data.literacyRate || '-'}
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
                    key="gdp"
                >
                    <div className={styles.label}>
                        GDP
                    </div>
                    <div className={styles.value}>
                        {data.gdp || '-'}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        // tslint:disable-next-line variable-name
        const Details = this.renderCountryDetailInfo;

        return (
            <div className={styles.countryDetails}>
                <h3 className={styles.title}>
                    Country details
                </h3>
                <Details />
            </div>
        );
    }
}
