import React from 'react';
import { connect } from 'react-redux';

import { dashboardSectorSelector } from '../../../redux';

import {
    RootState,
    Sector,
} from '../../../redux/interface';

import styles from '../styles.scss';

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

    static renderLoadingMessage = () => (
        <div className={styles.message}>
            <h3> Loading... </h3>
        </div>
    )

    static renderSelectSectorMessage = () => (
        <div className={styles.message}>
            <h3> Select a sector </h3>
        </div>
    )

    render() {
        const {
            // loading,
            selectedSector,
        } = this.props;

        if (!selectedSector.id) {
            return SectorDetailInfo.renderSelectSectorMessage();
        }

        /*
        if (loading) {
            return SectorDetailInfo.renderLoadingMessage();
        }
        */

        return (
            <div className={styles.message}>
                <h3> Data Not Available</h3>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    selectedSector: dashboardSectorSelector(state),
});

export default connect<PropsFromState, OwnProps>(
    mapStateToProps,
)(SectorDetailInfo);
