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

// import Numeral from '../../../vendor/react-store/components/View/Numeral';

import CountriesDataGetRequest from '../requests/CountriesDataGetRequest';
import Item from '../Item';

import styles from './styles.scss';

interface OwnProps {
    className?: string;
}
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
                <Item
                    label="Provinces"
                    value={data.provinces}
                />
                <Item
                    label="Municipalities"
                    value={data.municipalities}
                />
                <Item
                    label="Paalikas"
                    value={data.paalikas}
                />
                <Item
                    label="Total population"
                    value={data.totalPopulation}
                />
                <Item
                    label="Area (sq.km)"
                    value={data.area}
                />
                <Item
                    label="Population Density"
                    value={data.populationDensity}
                />
                <Item
                    label="Poverty Rate"
                    value={data.povertyRate}
                />
                <Item
                    label="Literacy Rate"
                    value={data.literacyRate}
                />
                <Item
                    label="Population Under Poverty"
                    value={data.populationUnderPovertyLine}
                />
                <Item
                    label="Per Capita Income"
                    value={data.perCapitaIncome}
                />
                <Item
                    label="HDI"
                    value={data.humanDevelopmentIndex}
                />
                <Item
                    label="GDP"
                    value={data.gdp}
                />
            </div>
        );
    }

    render() {
        const { className } = this.props;

        // tslint:disable-next-line variable-name
        const Details = this.renderCountryDetailInfo;

        const classNames = [
            className,
            styles.countryDetails,
        ];

        return (
            <div className={classNames.join(' ')}>
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
