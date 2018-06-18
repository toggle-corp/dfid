import React from 'react';
import { connect } from 'react-redux';

import Message from '../../../../../vendor/react-store/components/View/Message';

import { programmeDataSelector } from '../../../../../redux';

import {
    RootState,
    ProgrammeData,
    ProgrammeSectorName,
    ProgrammeDatum,
} from '../../../../../redux/interface';

import ListItem from '../../../ListItem';
import Item from '../../../../../components/Item';
import { renderPound } from '../../../../../components/Renderer';

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

const renderSectorName = (data: ProgrammeSectorName) => data.sectorName;

export class ProgrammeDetailInfo extends React.PureComponent<Props, State>{
    keySelector = (data: ProgrammeSectorName) => data.sectorId;

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
                <h4 className={styles.heading}>
                    {program}
                </h4>
                <Item
                    label="Budget"
                    value={programBudget}
                    valueModifier={renderPound}
                />
                <Item
                    label="Description"
                    value={description}
                />
                <ListItem
                    label="Sector"
                    values={sectors}
                    valueModifier={renderSectorName}
                    keySelector={this.keySelector}
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
