import React from 'react';
import { connect } from 'react-redux';

import ListView from '../../../vendor/react-store/components/View/List/ListView';
import Message from '../../../vendor/react-store/components/View/Message';
import Numeral from '../../../vendor/react-store/components/View/Numeral';
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

import Item from '../Item';

import styles from './styles.scss';

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

const renderBudget = (data: number) => (
    <Numeral
        precision={0}
        value={data}
    />
);

const renderSector = (data: ProgrammeSectorName[]) => (
    <ListView
        className={styles.sectorList}
        data={data}
        modifier={renderProgrammeSectorName}
    />
);

const renderProgrammeSectorName = (k: undefined, data: ProgrammeSectorName) => (
    <div
        key={data.sectorId}
        className={styles.sectorName}
    >
        {data.sectorName}
    </div>
);

export class ProgrammeDetails extends React.PureComponent<Props, State>{
    programmeDataRequest: RestRequest;

    render() {
        const {
            loading,
            selectedProgramme,
            selectedProgrammeData,
        } = this.props;


        if (!selectedProgramme.id) {
            return (
                <Message className={styles.message}>
                    Select a programme
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

        const {
            programBudget,
            sectors,
            program,
            description,
        } = selectedProgrammeData;

        return (
            <div className={styles.programmeDetails}>
                <Item
                    label="Programme"
                    value={program}
                />
                <Item
                    label="Budget"
                    value={programBudget}
                    valueModifier={renderBudget}
                />
                <Item
                    label="Sector"
                    value={sectors}
                    valueModifier={renderSector}
                />
                <Item
                    label="Description"
                    value={description}
                />
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
