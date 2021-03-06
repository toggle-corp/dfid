import React from 'react';
import { connect } from 'react-redux';

import Message from '../../../../vendor/react-store/components/View/Message';
import ListView from '../../../../vendor/react-store/components/View/List/ListView';
import { dashboardProgrammesSelector } from '../../../../redux';

import {
    RootState,
    Programme,
} from '../../../../redux/interface';

import ProgrammeDetailInfo from './ProgrammeDetailInfo';

import styles from './styles.scss';

interface OwnProps {
    loading?: boolean;
}
interface PropsFromState {
    selectedProgrammes: Programme[];
}

type Props = OwnProps & PropsFromState;

interface State {}

export class MultiProgrammeDetailInfo extends React.PureComponent<Props, State>{
    keyExtractor = (item: Programme) => String(item.id);

    renderProgrammeDetail = (key: string, datum: Programme, i: number, data: Programme[]) => {
        return (
            <ProgrammeDetailInfo
                key={key}
                datum={datum}
            />
        );
    }

    render() {
        const {
            loading,
            selectedProgrammes,
        } = this.props;

        if (!selectedProgrammes.length) {
            return (
                <Message className={styles.message}>
                    No program selected
                </Message>
            );
        }

        if (loading) {
            return (
                <Message>
                    Loading programme information...
                </Message>
            );
        }

        return (
            <ListView
                className={styles.programmeList}
                data={selectedProgrammes}
                keyExtractor={this.keyExtractor}
                modifier={this.renderProgrammeDetail}
            />
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    selectedProgrammes: dashboardProgrammesSelector(state),
});

export default connect<PropsFromState, OwnProps>(
    mapStateToProps,
)(MultiProgrammeDetailInfo);
