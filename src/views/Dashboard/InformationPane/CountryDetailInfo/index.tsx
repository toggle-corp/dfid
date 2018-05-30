import React from 'react';
import { connect } from 'react-redux';

import { RestRequest } from '../../../../vendor/react-store/utils/rest';
import Message from '../../../../vendor/react-store/components/View/Message';

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
}

const mapStateToProps = (state: RootState) => ({
    countryData: countryDataSelector(state),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps,
)(CountryDetailInfo);
