import React from 'react';
import { connect } from 'react-redux';

import Message from '../../../../../vendor/react-store/components/View/Message';

import { sectorDataSelector } from '../../../../../redux';
import {
    RootState,
    Sector,
    SectorDatum,
} from '../../../../../redux/interface';

import styles from './styles.scss';

interface OwnProps {
    datum: SectorDatum;
}
interface PropsFromState {
    selectedSectorData: Sector;
}

type Props = OwnProps & PropsFromState;

interface State {}

export class SectorDetailInfo extends React.PureComponent<Props, State>{
    render() {
        const {
            selectedSectorData,
        } = this.props;

        if (!selectedSectorData.id) {
            return (
                <Message className={styles.message}>
                    Data not available
                </Message>
            );
        }

        // FIXME: complete this
        return (
            <div className={styles.sectorDetails}>
                {selectedSectorData.name}
            </div>
        );
    }
}

const mapStateToProps = (state: RootState, props: Props) => ({
    selectedSectorData: sectorDataSelector(state, props),
});

export default connect<PropsFromState, OwnProps>(
    mapStateToProps,
)(SectorDetailInfo);
