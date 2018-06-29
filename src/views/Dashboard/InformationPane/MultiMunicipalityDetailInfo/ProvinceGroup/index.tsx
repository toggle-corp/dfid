import React from 'react';
import { connect } from 'react-redux';

import Message from '../../../../../vendor/react-store/components/View/Message';
import ListView from '../../../../../vendor/react-store/components/View/List/ListView';
import { dashboardProvinceMunicipalitiesSelector } from '../../../../../redux';

import {
    RootState,
    Municipality,
    MunicipalityDatum,
    ProvinceDatum,
} from '../../../../../redux/interface';

import MunicipalityDetailInfo from './MunicipalityDetailInfo';

import styles from '.././styles.scss';

interface OwnProps {
    loading?: boolean;
    datum: ProvinceDatum;
}
interface PropsFromState {
    selectedMunicipalites: Municipality[];
}

type Props = OwnProps & PropsFromState;

interface State {}

const keyExtractor = (item: Municipality) => String(item.id);

export class ProvinceGroup extends React.PureComponent<Props, State>{

    renderMunicipalityDetail = (
        key: string, datum: MunicipalityDatum, i: number, data: Municipality[],
    ) => {
        return (
            <MunicipalityDetailInfo
                key={key}
                datum={datum}
            />
        );
    }

    render() {
        const {
            loading,
            selectedMunicipalites,
        } = this.props;

        if (!selectedMunicipalites.length) {
            return null;
            /*
            return (
                <Message className={styles.message}>
                    No municipality selected (Selected them from map)
                </Message>
            );
             */
        }

        if (loading) {
            return (
                <Message>
                    Loading municipality information...
                </Message>
            );
        }

        return (
            <ListView
                className={styles.municipalityList}
                data={selectedMunicipalites}
                keyExtractor={keyExtractor}
                modifier={this.renderMunicipalityDetail}
            />
        );
    }
}

const mapStateToProps = (state: RootState, props: Props) => ({
    selectedMunicipalites: dashboardProvinceMunicipalitiesSelector(state, props),
});

export default connect<PropsFromState, OwnProps>(
    mapStateToProps,
)(ProvinceGroup);