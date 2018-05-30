import React from 'react';
import { connect } from 'react-redux';

import ListView from '../../../vendor/react-store/components/View/List/ListView';
import Message from '../../../vendor/react-store/components/View/Message';
import Numeral from '../../../vendor/react-store/components/View/Numeral';
import { RestRequest } from '../../../vendor/react-store/utils/rest';

import { programmeDataSelector } from '../../../redux';

import {
    RootState,
    ProgrammeData,
    ProgrammeSectorName,
    ProgrammeDatum,
} from '../../../redux/interface';

import Item from '../Item';

import styles from './styles.scss';

interface OwnProps {
    datum: ProgrammeDatum;
}
interface PropsFromState {
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

export class ProgrammeDetailInfo extends React.PureComponent<Props, State>{
    programmeDataRequest: RestRequest;

    render() {
        const {
            selectedProgrammeData,
        } = this.props;

        if (!selectedProgrammeData.id) {
            return (
                <Message className={styles.message}>
                    Data not available
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

const mapStateToProps = (state: RootState, props: Props) => ({
    selectedProgrammeData: programmeDataSelector(state, props),
});

export default connect<PropsFromState, OwnProps>(
    mapStateToProps,
)(ProgrammeDetailInfo);
