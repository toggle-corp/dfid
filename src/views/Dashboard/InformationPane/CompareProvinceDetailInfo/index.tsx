import React from 'react';
import { connect } from 'react-redux';

import Message from '../../../../vendor/react-store/components/View/Message';
import Numeral from '../../../../vendor/react-store/components/View/Numeral';
import Table, {
    Header,
} from '../../../../vendor/react-store/components/View/Table';
import {
    compareString,
    compareNumber,
} from '../../../../vendor/react-store/utils/common';

import { dashboardProvincesDataSelector } from '../../../../redux';

import {
    RootState,
    ProvinceData,
    ProgrammeName,
} from '../../../../redux/interface';

import ListItem from '../../ListItem';

import styles from './styles.scss';

interface OwnProps {
    loading?: boolean;
}
interface PropsFromState {
    selectedProvincesData: ProvinceData[];
}

type Props = OwnProps & PropsFromState;

interface State {}

const renderProgrammeName = (datum: ProgrammeName) => datum.programName;

const keySelector = (data: ProgrammeName) => data.programID;

export class CompareProvinceDetailInfo extends React.PureComponent<Props, State>{
    headers: Header<ProvinceData>[];

    constructor(props: Props) {
        super(props);

        this.headers = [
            {
                key: 'province',
                label: 'Province',
                order: 1,
                sortable: true,
                comparator: (a, b) => compareString(a.province, b.province),
            },
            {
                key: 'totalPopulation',
                label: 'Total population',
                order: 2,
                sortable: true,
                comparator: (a, b) => compareNumber(a.totalPopulation, b.totalPopulation),
                modifier: d => (
                    <Numeral
                        precision={0}
                        value={d.totalPopulation}
                    />
                ),
            },
            {
                key: 'district',
                label: 'No. of districts',
                order: 3,
                sortable: true,
                comparator: (a, b) => compareNumber(a.district, b.district),
                modifier: d => (
                    <Numeral
                        precision={0}
                        value={d.district}
                    />
                ),
            },
            {
                key: 'area',
                label: 'Area (sq.km)',
                order: 4,
                sortable: true,
                comparator: (a, b) => compareNumber(a.area, b.area),
                modifier: d => (
                    <Numeral
                        precision={0}
                        value={d.area}
                    />
                ),
            },
            {
                key: 'populationDensity',
                label: 'Population density (sq.km)',
                order: 5,
                sortable: true,
                comparator: (a, b) => compareNumber(a.populationDensity, b.populationDensity),
                modifier: d => (
                    <Numeral
                        precision={0}
                        value={d.populationDensity}
                    />
                ),
            },
            {
                key: 'povertyRate',
                label: 'Poverty rate',
                order: 6,
                sortable: true,
                comparator: (a, b) => compareNumber(a.povertyRate, b.povertyRate),
                modifier: d => (
                    <Numeral
                        precision={2}
                        suffix=" %"
                        value={100 * d.povertyRate}
                    />
                ),
            },
            {
                key: 'populationUnderPovertyLine',
                label: 'Population under poverty',
                order: 7,
                sortable: true,
                comparator: (a, b) =>
                    compareNumber(a.populationUnderPovertyLine, b.populationUnderPovertyLine),
                modifier: d => (
                    <Numeral
                        precision={0}
                        value={d.populationUnderPovertyLine}
                    />
                ),
            },
            {
                key: 'perCapitaIncome',
                label: 'Per capita income',
                order: 8,
                sortable: true,
                comparator: (a, b) => compareNumber(a.perCapitaIncome, b.perCapitaIncome),
                modifier: d => (
                    <Numeral
                        precision={0}
                        prefix="$"
                        value={d.perCapitaIncome}
                    />
                ),
            },
            {
                key: 'hhByLowestWealthQuantiles',
                label: 'HH by lowest wealth quantiles',
                order: 9,
                sortable: true,
                comparator: (a, b) =>
                    compareNumber(a.hhByLowestWealthQuantiles, b.hhByLowestWealthQuantiles),
                modifier: d => (
                    <Numeral
                        value={d.hhByLowestWealthQuantiles}
                    />
                ),
            },
            {
                key: 'humanDevelopmentIndex',
                label: 'HDI',
                order: 10,
                sortable: true,
                comparator: (a, b) =>
                    compareNumber(a.humanDevelopmentIndex, b.humanDevelopmentIndex),
                modifier: d => (
                    <Numeral
                        value={d.humanDevelopmentIndex}
                    />
                ),
            },
            {
                key: 'minuteAccessTo',
                label: 'Minute access to health care',
                order: 11,
                sortable: true,
                comparator: (a, b) => compareNumber(a.minuteAccessTo, b.minuteAccessTo),
                modifier: d => (
                    <Numeral
                        value={d.minuteAccessTo}
                    />
                ),
            },
            {
                key: 'vulnerabilityIndex',
                label: 'Vulnerability index',
                order: 12,
                sortable: true,
                comparator: (a, b) => compareNumber(a.vulnerabilityIndex, b.vulnerabilityIndex),
                modifier: d => (
                    <Numeral
                        value={d.vulnerabilityIndex}
                    />
                ),
            },
            {
                key: 'gdp',
                label: 'GDP',
                order: 13,
                sortable: true,
                comparator: (a, b) => compareNumber(a.gdp, b.gdp),
                modifier: d => (
                    <Numeral
                        precision={0}
                        prefix="$"
                        value={d.gdp}
                    />
                ),
            },
            {
                key: 'totalBudget',
                label: 'Total budget',
                order: 14,
                sortable: true,
                comparator: (a, b) => compareNumber(a.totalBudget, b.totalBudget),
                modifier: d => (
                    <Numeral
                        precision={0}
                        prefix="£"
                        value={d.totalBudget}
                    />
                ),
            },
            {
                key: 'activeProgrammes',
                label: 'Active programmes',
                order: 15,
                modifier: d => (
                    <ListItem
                        label="Active programmes"
                        values={d.activeProgrammes}
                        valueModifier={renderProgrammeName}
                        keySelector={keySelector}
                    />
                ),
            },
        ];
    }

    keyExtractor = (item: ProvinceData) => item.id;

    render() {
        const {
            loading,
            selectedProvincesData,
        } = this.props;

        if (!selectedProvincesData.length) {
            return (
                <Message className={styles.message}>
                    No province selected
                </Message>
            );
        }

        if (loading) {
            return (
                <Message className={styles.message}>
                    Loading province information...
                </Message>
            );
        }

        return (
            <div className={styles.compareProvinceDetailInfo}>
                <Table
                    className={styles.table}
                    data={selectedProvincesData}
                    headers={this.headers}
                    keyExtractor={this.keyExtractor}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    selectedProvincesData: dashboardProvincesDataSelector(state),
});

export default connect<PropsFromState, OwnProps>(
    mapStateToProps,
)(CompareProvinceDetailInfo);
