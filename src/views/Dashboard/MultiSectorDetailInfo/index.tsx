import React from 'react';
import { connect } from 'react-redux';

import Message from '../../../vendor/react-store/components/View/Message';
import ListView from '../../../vendor/react-store/components/View/List/ListView';
import { dashboardSectorsSelector } from '../../../redux';

import {
    RootState,
    Sector,
} from '../../../redux/interface';

import SectorDetailInfo from '../SectorDetailInfo';

import styles from './styles.scss';

interface OwnProps {
    loading?: boolean;
}
interface PropsFromState {
    selectedSectors: Sector[];
}

type Props = OwnProps & PropsFromState;

interface State {}


export class MultiSectorDetailInfo extends React.PureComponent<Props, State>{
    keyExtractor = (item: Sector) => item.id;

    renderItem = (key: string, item: Sector) => (
        <SectorDetailInfo
            key={key}
            sectorId={item.id}
        />
    )

    render() {
        const {
            loading,
            selectedSectors,
        } = this.props;

        if (!selectedSectors.length) {
            return (
                <Message>
                    Select a sector
                </Message>
            );
        }

        if (loading) {
            return (
                <Message>
                    Loading sector information...
                </Message>
            );
        }

        return (
            <ListView
                className={styles.sectorList}
                data={selectedSectors}
                modifier={this.renderItem}
                keyExtractor={this.keyExtractor}
            />
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    selectedSectors: dashboardSectorsSelector(state),
});

export default connect<PropsFromState, OwnProps>(
    mapStateToProps,
)(MultiSectorDetailInfo);
