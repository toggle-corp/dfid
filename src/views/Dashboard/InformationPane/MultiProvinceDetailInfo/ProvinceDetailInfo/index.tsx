import React from 'react';
import { connect } from 'react-redux';

import Message from '../../../../../vendor/react-store/components/View/Message';
import { provinceDataSelector } from '../../../../../redux';

import {
    RootState,
    ProvinceData,
    ProgrammeName,
    ProvinceDatum,
} from '../../../../../redux/interface';

import ListItem from '../../../ListItem';

import Item from '../../../../../components/Item';
import {
    renderPound,
    renderDollar,
    renderNumeral,
    renderPercent,
    renderNormalNumeral,
} from '../../../../../components/Renderer';

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
                    valueModifier={renderNumeral}
                />
                <Item
                    label="Area (sq.km)"
                    value={area}
                    valueModifier={renderNumeral}
                />
                <Item
                    label="Population density (sq.km)"
                    value={populationDensity}
                    valueModifier={renderNumeral}
                />
                <Item
                    label="Poverty rate"
                    value={povertyRate}
                    valueModifier={renderPercent}
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
                    valueModifier={renderNormalNumeral}
                />
                <Item
                    label="HDI"
                    value={humanDevelopmentIndex}
                    valueModifier={renderNormalNumeral}
                />
                <Item
                    label="Minute access to health care"
                    value={minuteAccessTo}
                    valueModifier={renderNormalNumeral}
                />
                <Item
                    label="Vulnerability index"
                    value={vulnerabilityIndex}
                    valueModifier={renderNormalNumeral}
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
