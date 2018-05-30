import React from 'react';
import { connect } from 'react-redux';

import Message from '../../../../../vendor/react-store/components/View/Message';
import Numeral from '../../../../../vendor/react-store/components/View/Numeral';
import { provinceDataSelector } from '../../../../../redux';

import {
    RootState,
    ProvinceData,
    ProgrammeName,
    ProvinceDatum,
} from '../../../../../redux/interface';

import ListItem from '../../../ListItem';

import Item from '../../../../../components/Item';

import styles from './styles.scss';

interface OwnProps {
    datum: ProvinceDatum;
}
interface PropsFromState {
    selectedProvinceData: ProvinceData;
}

type Props = OwnProps & PropsFromState;

interface State {
}

const renderProgrammeName = (datum: ProgrammeName) => datum.programName;

const renderPound = (data: number) => (
    <Numeral
        precision={0}
        value={data}
        prefix="£"
    />
);
const renderDollar = (data: number) => (
    <Numeral
        precision={0}
        value={data}
        prefix="$"
    />
);
const renderNumeral = (data: number) => (
    <Numeral
        precision={0}
        value={data}
    />
);

export class ProvinceDetailInfo extends React.PureComponent<Props, State>{

    keySelector = (data: ProgrammeName) => data.programID;

    render() {
        const {
            selectedProvinceData,
        } = this.props;

        if (!selectedProvinceData.id) {
            return (
                <Message className={styles.message}>
                    Data not available
                </Message>
            );
        }

        const {
            province,
            totalPopulation,
            district,
            area,
            populationDensity,
            povertyRate,
            populationUnderPovertyLine,
            perCapitaIncome,
            hhByLowestWealthQuantiles,
            humanDevelopmentIndex,
            minuteAccessTo,
            vulnerabilityIndex,
            gdp,
            totalBudget,
            activeProgrammes,
        } = selectedProvinceData;

        return (
            <div className={styles.provinceDetails}>
                <h4 className={styles.heading}>
                    {province}
                </h4>
                <Item
                    label="Total population"
                    value={totalPopulation}
                    valueModifier={renderNumeral}
                />
                <Item
                    label="No. of districts"
                    value={district}
                />
                <Item
                    label="Area (sq.km)"
                    value={area}
                    valueModifier={renderNumeral}
                />
                <Item
                    label="Population density"
                    value={populationDensity}
                />
                <Item
                    label="Poverty rate"
                    value={povertyRate}
                />
                <Item
                    label="Population under poverty"
                    value={populationUnderPovertyLine}
                    valueModifier={renderNumeral}
                />
                <Item
                    label="Per capita income"
                    value={perCapitaIncome}
                    valueModifier={renderDollar}
                />
                <Item
                    label="HH by lowest wealth quantiles"
                    value={hhByLowestWealthQuantiles}
                />
                <Item
                    label="HDI"
                    value={humanDevelopmentIndex}
                />
                <Item
                    label="Minute access to"
                    value={minuteAccessTo}
                />
                <Item
                    label="Vulnerability index"
                    value={vulnerabilityIndex}
                />
                <Item
                    label="GDP"
                    value={gdp}
                    valueModifier={renderDollar}
                />
                <Item
                    label="Total budget"
                    value={totalBudget}
                    valueModifier={renderPound}
                />
                <ListItem
                    label="Active programmes"
                    values={activeProgrammes}
                    valueModifier={renderProgrammeName}
                    keySelector={this.keySelector}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState, props: Props) => ({
    selectedProvinceData: provinceDataSelector(state, props),
});

export default connect<PropsFromState, OwnProps>(
    mapStateToProps,
)(ProvinceDetailInfo);
