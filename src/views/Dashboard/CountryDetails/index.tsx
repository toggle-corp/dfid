import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import { RestRequest } from '../../../vendor/react-store/utils/rest';

import {
    RootState,
    CountryData,
    SetCountriesDataAction,
} from '../../../redux/interface';
import {
    countryDataSelector,
    setCountriesDataAction,
} from '../../../redux';

import Numeral from '../../../vendor/react-store/components/View/Numeral';

import CountriesDataGetRequest from '../requests/CountriesDataGetRequest';

import * as styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    countryData: CountryData;
}
interface PropsFromDispatch {
    setCountriesData(params: SetCountriesDataAction): void;
}
type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State {
    countryData?: CountryData;
    loadingCountryData: boolean;
}

export class CountryDetails extends React.PureComponent<Props, State>{
    countryDataRequest: RestRequest;

    constructor(props: Props) {
        super(props);

        this.state = {
            loadingCountryData: true,
        };
    }

    componentDidMount() {
        this.startRequestForCountriesData();
    }

    startRequestForCountriesData = () => {
        if (this.countryDataRequest) {
            this.countryDataRequest.stop();
        }
        const countryDataRequest = new CountriesDataGetRequest({
            setState: params => this.setState(params),
            setCountriesData: this.props.setCountriesData,
        });
        this.countryDataRequest = countryDataRequest.create();
        this.countryDataRequest.start();
    }

    componentWillUnmount() {
        if (this.countryDataRequest) {
            this.countryDataRequest.stop();
        }
    }

    renderCountryDetailInfo = () => {
        const { countryData: data } = this.props;

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
                    <Numeral
                        className={styles.value}
                        precision={0}
                        value={data.totalPopulation}
                    />
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

const mapStateToProps = (state: RootState) => ({
    countryData: countryDataSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setCountriesData: (params: SetCountriesDataAction) => dispatch(setCountriesDataAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(CountryDetails);
