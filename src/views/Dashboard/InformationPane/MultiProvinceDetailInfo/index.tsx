import React from 'react';
import { connect } from 'react-redux';

import Message from '../../../../vendor/react-store/components/View/Message';
import ListView from '../../../../vendor/react-store/components/View/List/ListView';
import { dashboardProvincesSelector } from '../../../../redux';

import {
    RootState,
    Province,
} from '../../../../redux/interface';

import ProvinceDetailInfo from './ProvinceDetailInfo';

import styles from './styles.scss';

interface OwnProps {
    loading?: boolean;
}
interface PropsFromState {
    selectedProvinces: Province[];
}

type Props = OwnProps & PropsFromState;

interface State {}

export class MultiProvinceDetailInfo extends React.PureComponent<Props, State>{
    keyExtractor = (item: Province) => item.id;

    render() {
        const {
            loading,
            selectedProvinces,
        } = this.props;

        if (!selectedProvinces.length) {
            return (
                <Message className={styles.message}>
                    No province selected
                </Message>
            );
        }

        if (loading) {
            return (
                <Message className={styles.message}>
                    Loading province information...
                </Message>
            );
        }

        return (
            <ListView
                className={styles.provinceList}
                data={selectedProvinces}
                keyExtractor={this.keyExtractor}
                renderer={ProvinceDetailInfo}
            />
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    selectedProvinces: dashboardProvincesSelector(state),
});

export default connect<PropsFromState, OwnProps>(
    mapStateToProps,
)(MultiProvinceDetailInfo);
