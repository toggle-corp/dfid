import React from 'react';
import { connect } from 'react-redux';

import Message from '../../../vendor/react-store/components/View/Message';
import ListView from '../../../vendor/react-store/components/View/List/ListView';
import { dashboardProvincesSelector } from '../../../redux';

import {
    RootState,
    Province,
} from '../../../redux/interface';

import ProvinceDetailInfo from '../ProvinceDetailInfo';

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

    renderItem = (key: string, item: Province) => (
        <ProvinceDetailInfo
            key={key}
            provinceId={item.id}
        />
    )

    render() {
        const {
            loading,
            selectedProvinces,
        } = this.props;

        if (!selectedProvinces.length) {
            return (
                <Message>
                    Select a province
                </Message>
            );
        }

        if (loading) {
            return (
                <Message>
                    Loading province information...
                </Message>
            );
        }

        return (
            <ListView
                className={styles.provinceList}
                data={selectedProvinces}
                modifier={this.renderItem}
                keyExtractor={this.keyExtractor}
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
