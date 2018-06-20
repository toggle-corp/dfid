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

import { renderPound } from '../../../../components/Renderer';
import { dashboardProgrammesDataSelector } from '../../../../redux';

import {
    RootState,
    ProgrammeData,
    ProgrammeSectorName,
} from '../../../../redux/interface';

import ListItem from '../../ListItem';

import styles from './styles.scss';

interface OwnProps {
    loading?: boolean;
}
interface PropsFromState {
    selectedProgrammesData: ProgrammeData[];
}

type Props = OwnProps & PropsFromState;

interface State {}

const renderSectorName = (data: ProgrammeSectorName) => data.sectorName;

const keySelector = (data: ProgrammeSectorName) => data.sectorId;

export class CompareProgrammeDetailInfo extends React.PureComponent<Props, State>{
    headers: Header<ProgrammeData>[];

    constructor(props: Props) {
        super(props);

        this.headers = [
            {
                key: 'program',
                label: 'Program',
                order: 1,
                sortable: true,
                comparator: (a, b) => compareString(a.program, b.program),
            },
            {
                key: 'programBudget',
                label: 'Budget',
                order: 2,
                sortable: true,
                comparator: (a, b) => compareNumber(a.programBudget, b.programBudget),
                modifier: d => renderPound(d.programBudget),
            },
            {
                key: 'description',
                label: 'Description',
                order: 3,
                sortable: true,
                comparator: (a, b) => compareString(a.description, b.description),
            },
            {
                key: 'sectors',
                label: 'Sectors',
                order: 4,
                modifier: d => (
                    <ListItem
                        label="Sector"
                        values={d.sectors}
                        valueModifier={renderSectorName}
                        keySelector={keySelector}
                    />
                ),
            },
        ];
    }

    keyExtractor = (item: ProgrammeData) => item.id;

    render() {
        const {
            loading,
            selectedProgrammesData,
        } = this.props;

        if (!selectedProgrammesData.length) {
            return (
                <Message className={styles.message}>
                    No programme selected
                </Message>
            );
        }

        if (loading) {
            return (
                <Message className={styles.message}>
                    Loading programme information...
                </Message>
            );
        }

        return (
            <div className={styles.compareProgrammeDetailInfo}>
                <Table
                    data={selectedProgrammesData}
                    headers={this.headers}
                    keyExtractor={this.keyExtractor}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    selectedProgrammesData: dashboardProgrammesDataSelector(state),
});

export default connect<PropsFromState, OwnProps>(
    mapStateToProps,
)(CompareProgrammeDetailInfo);
