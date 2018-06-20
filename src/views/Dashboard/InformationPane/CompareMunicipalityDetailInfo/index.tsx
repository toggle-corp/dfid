import React from 'react';
import { connect } from 'react-redux';

import Message from '../../../../vendor/react-store/components/View/Message';
import Table, {
    Header,
} from '../../../../vendor/react-store/components/View/Table';
import {
    compareString,
    compareNumber,
} from '../../../../vendor/react-store/utils/common';
import {
    renderPound,
    renderNumeral,
} from '../../../../components/Renderer';

import { dashboardMunicipalitiesSelector } from '../../../../redux';

import {
    RootState,
    Municipality,
    MunicipalityProgramme,
} from '../../../../redux/interface';

import ListItem from '../../ListItem';

import styles from './styles.scss';

interface OwnProps {
    loading?: boolean;
}
interface PropsFromState {
    selectedMunicipalites: Municipality[];
}

type Props = OwnProps & PropsFromState;

interface State {}

const renderProgramName = (data: MunicipalityProgramme) => data.program;

const keySelector = (data: MunicipalityProgramme) => data.programId;

export class CompareMunicipalityDetailInfo extends React.PureComponent<Props, State>{
    headers: Header<Municipality>[];

    constructor(props: Props) {
        super(props);

        this.headers = [
            {
                key: 'localName',
                label: 'Local Name',
                order: 1,
                sortable: true,
                comparator: (a, b) => compareString(a.localName, b.localName),
            },
            {
                key: 'type',
                label: 'Type',
                order: 2,
                sortable: true,
                comparator: (a, b) => compareString(a.type, b.type),
            },
            {
                key: 'totalProgramBudget',
                label: 'Budget',
                order: 3,
                sortable: true,
                comparator: (a, b) => compareNumber(a.totalProgramBudget, b.totalProgramBudget),
                modifier: d => renderPound(d.totalProgramBudget),
            },
            {
                key: 'hlcitCode',
                label: 'HLCIT Code',
                order: 4,
                sortable: true,
                comparator: (a, b) => compareString(a.hlcitCode, b.hlcitCode),
            },
            {
                key: 'totalNoOfProgrammes',
                label: 'Total No Of Programmes',
                order: 4,
                sortable: true,
                comparator: (a, b) => compareNumber(a.totalNoOfProgrammes, b.totalNoOfProgrammes),
                modifier: row => renderNumeral(row.totalNoOfProgrammes),
            },
            {
                key: 'programs',
                label: 'Programs',
                order: 5,
                modifier: d => (
                    <ListItem
                        label="Programs"
                        values={d.programs}
                        valueModifier={renderProgramName}
                        keySelector={keySelector}
                    />
                ),
            },
        ];
    }

    keyExtractor = (item: Municipality) => item.id;

    render() {
        const {
            loading,
            selectedMunicipalites,
        } = this.props;

        if (!selectedMunicipalites.length) {
            return (
                <Message className={styles.message}>
                    No Municipality Selected
                </Message>
            );
        }

        if (loading) {
            return (
                <Message className={styles.message}>
                    Loading municipality information...
                </Message>
            );
        }

        return (
            <div className={styles.compareMunicipalityDetailInfo}>
                <Table
                    data={selectedMunicipalites}
                    headers={this.headers}
                    keyExtractor={this.keyExtractor}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    selectedMunicipalites: dashboardMunicipalitiesSelector(state),
});

export default connect<PropsFromState, OwnProps>(
    mapStateToProps,
)(CompareMunicipalityDetailInfo);
