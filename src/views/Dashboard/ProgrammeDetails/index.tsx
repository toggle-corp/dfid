import React from 'react';
import { connect } from 'react-redux';

import Numeral from '../../../vendor/react-store/components/View/Numeral';
import ListView from '../../../vendor/react-store/components/View/List/ListView';

import { RestRequest } from '../../../vendor/react-store/utils/rest';

import {
    dashboardProgrammeSelector,
    dashboardProgrammeDataSelector,
} from '../../../redux';


import {
    RootState,
    ProgrammeData,
    Programme,
    ProgrammeSectorName,
} from '../../../redux/interface';

import styles from '../styles.scss';

interface OwnProps {
    loading?: boolean;
}
interface PropsFromState {
    selectedProgramme: Programme;
    selectedProgrammeData: ProgrammeData;
}
type Props = OwnProps & PropsFromState ;

interface State {
    programmeData: object;
}

interface ProgrammeField {
    key: string;
    label: string;
    value?: object | string | number;
}

export class ProgrammeDetails extends React.PureComponent<Props, State>{
    programmeDataRequest: RestRequest;

    constructor(props: Props) {
        super(props);
        const { selectedProgrammeData } = props;
        const {
            generateProgrammeDataDetailInfo,
            getProgrammeFields,
        } = ProgrammeDetails;
        const programmeData = generateProgrammeDataDetailInfo(
            getProgrammeFields(selectedProgrammeData),
            selectedProgrammeData,
        );
        this.state = { programmeData };
    }

    componentWillReceiveProps(nextProps: Props) {
        const { selectedProgrammeData } = nextProps;
        if (this.props.selectedProgrammeData !== selectedProgrammeData) {
            const {
                generateProgrammeDataDetailInfo,
                getProgrammeFields,
            } = ProgrammeDetails;
            const programmeData = generateProgrammeDataDetailInfo(
                getProgrammeFields(selectedProgrammeData),
                selectedProgrammeData,
            );
            this.setState({ programmeData });
        }
    }

    static generateProgrammeDataDetailInfo = (
        items: ProgrammeField[], programmeData: ProgrammeData,
    ) => (
        items.map(item =>
            ProgrammeDetails.renderProgrammeField({
                key: item.key,
                label: item.label,
                value: item.value || programmeData[item.key],
            }),
        )
    )

    static getProgrammeFields = (data: ProgrammeData) => [
        { key: 'program', label: 'Programme' },
        {
            key: 'programBudget',
            label: 'Budget',
            value: (
                <Numeral
                    className={styles.value}
                    precision={0}
                    value={data.programBudget}
                />
            ),
        },
        {
            key: 'programmeSectorName',
            label: 'Sector',
            value: (
                    <ListView
                        className={`${styles.value} ${styles.programme}`}
                        data={data.sectors}
                        modifier={ProgrammeDetails.renderProgrammeSectorName}
                    />
            ),
        },
        {
            key: 'description',
            label: 'Desciription',
        },
    ]


    static renderProgrammeSectorName = (k: undefined, data: ProgrammeSectorName) => (
        <div
            key={data.sectorId}
            className={styles.programmeName}
        >
            <span className={styles.title}>{data.sectorName}</span>
        </div>
    )

    static renderProgrammeField = ({ key, label, value }: ProgrammeField) => (
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

    static renderSelectProgrammeMessage = () => (
        <div className={styles.message}>
            <h3> Select a programme </h3>
        </div>
    )

    static renderLoadingMessage = () => (
        <div className={styles.message}>
            Loading Programme Information ...
        </div>
    )


    render() {
        const {
            loading,
            selectedProgramme,
        } = this.props;
        const { programmeData } = this.state;

        if (!selectedProgramme.id) {
            return ProgrammeDetails.renderSelectProgrammeMessage();
        }

        if (loading) {
            return ProgrammeDetails.renderLoadingMessage();
        }

        return (
            <div className={styles.programmeDetails}>
                <div
                    className={styles.content}
                >
                    {programmeData}
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state: RootState) => ({
    selectedProgramme: dashboardProgrammeSelector(state),
    selectedProgrammeData: dashboardProgrammeDataSelector(state),
});

export default connect<PropsFromState, OwnProps>(
    mapStateToProps,
)(ProgrammeDetails);
