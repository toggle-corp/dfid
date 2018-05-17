import React from 'react';
import { connect } from 'react-redux';

import Message from '../../../vendor/react-store/components/View/Message';

import { dashboardSectorSelector } from '../../../redux';
import {
    RootState,
    Sector,
} from '../../../redux/interface';

import styles from './styles.scss';

interface OwnProps {
    loading?: boolean;
}
interface PropsFromState {
    selectedSector: Sector;
}

type Props = OwnProps & PropsFromState;

interface State {
    provinceData: object;
}

export class SectorDetailInfo extends React.PureComponent<Props, State>{
    render() {
        const {
            // loading,
            selectedSector,
        } = this.props;

        if (!selectedSector.id) {
            return (
                <Message className={styles.message}>
                    Select a sector
                </Message>
            );
        }

        /*
        if (loading) {
            return (
                <Message className={styles.message}>
                    Loading...
                </Message>
            );
        }
        */

        return (
            <Message className={styles.message}>
                Data not available
            </Message>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    selectedSector: dashboardSectorSelector(state),
});

export default connect<PropsFromState, OwnProps>(
    mapStateToProps,
)(SectorDetailInfo);
