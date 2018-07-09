import React from 'react';
import { connect } from 'react-redux';

import Message from '../../../../vendor/react-store/components/View/Message';
import ListView from '../../../../vendor/react-store/components/View/List/ListView';
import { dashboardProvincesSelector } from '../../../../redux';

import {
    RootState,
    Province,
    ProvinceDatum,
} from '../../../../redux/interface';

import ProvinceGroup from './ProvinceGroup';

import styles from './styles.scss';

interface OwnProps {
    loading?: boolean;
}
interface PropsFromState {
    selectedProvinces: Province[];
}

type Props = OwnProps & PropsFromState;

interface State {}

const keyExtractor = (item: Province) => String(item.id);

export class MultiMunicipalityDetailInfo extends React.PureComponent<Props, State>{

    renderProjectGroup = (
        key: string, datum: ProvinceDatum, i: number, data: Province[],
    ) => {
        return (
            <ProvinceGroup
                key={key}
                datum={datum}
            />
        );
    }

    render() {
        const {
            loading,
            selectedProvinces,
        } = this.props;

        if (!selectedProvinces.length) {
            return (
                <Message className={styles.message}>
                    No municipality selected
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
                className={styles.municipalityList}
                data={selectedProvinces}
                keyExtractor={keyExtractor}
                modifier={this.renderProjectGroup}
            />
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    selectedProvinces: dashboardProvincesSelector(state),
});

export default connect<PropsFromState, OwnProps>(
    mapStateToProps,
)(MultiMunicipalityDetailInfo);
