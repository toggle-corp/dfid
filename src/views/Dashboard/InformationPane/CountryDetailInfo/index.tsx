import React from 'react';
import { connect } from 'react-redux';

import { RestRequest } from '../../../../vendor/react-store/utils/rest';
import Message from '../../../../vendor/react-store/components/View/Message';
import Numeral from '../../../../vendor/react-store/components/View/Numeral';

import {
    RootState,
    CountryData,
} from '../../../../redux/interface';
import {
    countryDataSelector,
} from '../../../../redux';

import Item from '../../../../components/Item';

import styles from './styles.scss';

interface OwnProps {
    className?: string;
    loading: boolean;
}
interface PropsFromState {
    countryData: CountryData;
}
interface PropsFromDispatch {
}
type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State {
    countryData?: CountryData;
}

const renderNumeral = (data: number) => (
    <Numeral
        precision={0}
        value={data}
    />
);

const renderPercent = (data: number) => (
    <Numeral
        precision={2}
        suffix=" %"
        value={data ? data * 100 : undefined}
    />
);

const renderDollar = (data: number) => (
    <Numeral
        precision={0}
        value={data}
        prefix="$"
    />
);

export class CountryDetailInfo extends React.PureComponent<Props, State>{
    countryDataRequest: RestRequest;

    render() {
        const { countryData: data, loading } = this.props;

        if (loading) {
            return (
                <Message>
                    Loading country information...
                </Message>
            );
        }

        return (
            <div
                className={styles.content}
            >
                <Item
                    label="Provinces"
                    value={data.provinces}
                    valueModifier={renderNumeral}
                />
                <Item
                    label="Municipalities"
                    value={data.municipalities}
                    valueModifier={renderNumeral}
                />
                <Item
                    label="Paalikas"
                    value={data.paalikas}
                    valueModifier={renderNumeral}
                />
                <Item
                    label="Total population"
                    value={data.totalPopulation}
                    valueModifier={renderNumeral}
                />
                <Item
                    label="Area (sq.km)"
                    value={data.area}
                    // valueModifier={renderNumeral}
                />
                <Item
                    label="Population Density (sq.km)"
                    value={data.populationDensity}
                    valueModifier={renderNumeral}
                />
                <Item
                    label="Poverty Rate"
                    value={data.povertyRate}
                    valueModifier={renderPercent}
                />
                <Item
                    label="Literacy Rate"
                    value={data.literacyRate}
                    valueModifier={renderPercent}
                />
                <Item
                    label="Population Under Poverty"
                    value={data.populationUnderPovertyLine}
                    valueModifier={renderNumeral}
                />
                <Item
                    label="Per Capita Income"
                    value={data.perCapitaIncome}
                    valueModifier={renderDollar}
                />
                <Item
                    label="HDI"
                    value={data.humanDevelopmentIndex}
                    valueModifier={renderNumeral}
                />
                <Item
                    label="GDP"
                    value={data.gdp}
                    valueModifier={renderDollar}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    countryData: countryDataSelector(state),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps,
)(CountryDetailInfo);
