import React from 'react';
import { connect } from 'react-redux';

import Numeral from '../../../vendor/react-store/components/View/Numeral';
import ListView from '../../../vendor/react-store/components/View/List/ListView';
import {
    dashboardProvinceDataSelector,
    dashboardProvinceSelector,
} from '../../../redux';

import {
    RootState,
    ProvinceData,
    Province,
    ProgrammeName,
} from '../../../redux/interface';

import styles from '../styles.scss';

interface OwnProps {
    loading?: boolean;
}
interface PropsFromState {
    selectedProvince: Province;
    selectedProvinceData: ProvinceData;
}

type Props = OwnProps & PropsFromState;

interface State {
    provinceData: object;
}

interface ProvinceField {
    key: string;
    label: string;
    value?: object | string | number;
}

export class ProvinceDetailInfo extends React.PureComponent<Props, State>{
    constructor(props: Props) {
        super(props);

        const { selectedProvinceData } = props;
        const {
            generateProvinceDataDetailInfo,
            getProvinceFields,
        } = ProvinceDetailInfo;
        const provinceData = generateProvinceDataDetailInfo(
            getProvinceFields(selectedProvinceData),
            selectedProvinceData,
        );
        this.state = { provinceData };
    }

    componentWillReceiveProps(nextProps: Props) {
        const { selectedProvinceData } = nextProps;
        if (this.props.selectedProvinceData !== selectedProvinceData) {
            const {
                generateProvinceDataDetailInfo,
                getProvinceFields,
            } = ProvinceDetailInfo;
            const provinceData = generateProvinceDataDetailInfo(
                getProvinceFields(selectedProvinceData),
                selectedProvinceData,
            );
            this.setState({ provinceData });
        }
    }

    static generateProvinceDataDetailInfo = (
        items: ProvinceField[], provinceData: ProvinceData,
    ) => (
        items.map(item =>
            ProvinceDetailInfo.renderProvinceField({
                key: item.key,
                label: item.label,
                value: item.value || provinceData[item.key],
            }),
        )
    )

    static getProvinceFields = (data: ProvinceData) => [
        { key: 'province', label: 'Province' },
        {
            key: 'totalPopulation',
            label: 'Province',
            value: (
                <Numeral
                    className={styles.value}
                    precision={0}
                    value={data.totalPopulation}
                />
            ),
        },
        { key: 'district', label: 'No. of Districts' },
        {
            key: 'area',
            label: 'Area (sq.km)',
            value: (
                <Numeral
                    className={styles.value}
                    precision={0}
                    value={data.area}
                />
            ),
        },
        { key: 'populationDensity', label: 'Population Density' },
        { key: 'povertyRate', label: 'Poverty Rate' },
        {
            key: 'populationUnderPovertyLine',
            label: 'Population Under Poverty',
            value: (
                <Numeral
                    className={styles.value}
                    precision={0}
                    value={data.populationUnderPovertyLine}
                />
            ),
        },
        {
            key: 'perCapitaIncome',
            label: 'No. of Districts',
            value: (
                    <Numeral
                        className={styles.value}
                        precision={0}
                        prefix="$"
                        value={data.perCapitaIncome}
                    />
            ),
        },
        { key: 'hhByLowestWealthQuantiles', label: 'HH By Lowest Wealth Quantiles' },
        { key: 'humanDevelopmentIndex', label: 'HDI' },
        { key: 'minuteAccessTo', label: 'Minute Access To' },
        { key: 'vulnerabilityIndex', label: 'Vulnerability Index' },
        {
            key: 'gdp',
            label: 'GDP',
            value: (
                    <Numeral
                        className={styles.value}
                        precision={0}
                        prefix="$"
                        value={data.gdp}
                    />
            ),
        },
        {
            key: 'programmeName',
            label: 'Active Programmes',
            value: (
                    <ListView
                        className={`${styles.value} ${styles.programme}`}
                        data={data.activeProgrammes}
                        modifier={ProvinceDetailInfo.renderProgrammeName}
                    />
            ),
        },
        {
            key: 'totalBudget',
            label: 'Total Budget',
            value: (
                    <Numeral
                        className={styles.value}
                        precision={0}
                        prefix="£"
                        value={data.totalBudget}
                    />
            ),
        },
    ]

    static renderProgrammeName = (k: undefined, data: ProgrammeName) => (
        <div
            key={data.programID}
            className={styles.programmeName}
        >
            <span className={styles.marker}>•</span>
            <span className={styles.title}>{data.programName}</span>
        </div>
    )

    static renderProvinceField = ({ key, label, value }: ProvinceField) => (
        <div
            className={styles.item}
            key={key}
        >
            <div className={styles.label}>
                {label}
            </div>
            <div className={styles.value}>
                {value || '-'}
            </div>
        </div>
    )

    static renderSelectProvinceMessage = () => (
        <div className={styles.message}>
            <h3> Select a province </h3>
        </div>
    )

    static renderLoadingMessage = () => (
        <div className={styles.message}>
            Loading Province Information ...
        </div>
    )

    render() {
        const {
            loading,
            selectedProvince,
        } = this.props;
        const { provinceData } = this.state;

        if (!selectedProvince.id) {
            return ProvinceDetailInfo.renderSelectProvinceMessage();
        }

        if (loading) {
            return ProvinceDetailInfo.renderLoadingMessage();
        }

        return (
            // TODO: Fix the styles
            <div className={styles.provinceDetails}>
                <div
                    className={styles.content}
                >
                    {provinceData}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    selectedProvince: dashboardProvinceSelector(state),
    selectedProvinceData: dashboardProvinceDataSelector(state),
});

export default connect<PropsFromState, OwnProps>(
    mapStateToProps,
)(ProvinceDetailInfo);
