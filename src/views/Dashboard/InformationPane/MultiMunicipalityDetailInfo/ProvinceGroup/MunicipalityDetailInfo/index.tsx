import React from 'react';
import { connect } from 'react-redux';

import Message from '../../../../../../vendor/react-store/components/View/Message';

import { municipalityDataSelector } from '../../../../../../redux';

import {
    RootState,
    Municipality,
    MunicipalityProgramme,
    MunicipalityPartner,
    MunicipalityDatum,
} from '../../../../../../redux/interface';

import ListItem from '../../../../ListItem';
import Item from '../../../../../../components/Item';
import {
    renderPound,
    renderNumeral,
} from '../../../../../../components/Renderer';

import styles from './styles.scss';

interface OwnProps {
    datum: MunicipalityDatum;
}
interface PropsFromState {
    selectedMunicipalityData: Municipality;
}
type Props = OwnProps & PropsFromState ;

interface State {}

const progammeKeySelector = (data: MunicipalityProgramme) => data.programId;

const partnerKeySelector = (data: MunicipalityPartner) => data.name;

const renderProgramPartnerName = (data: MunicipalityPartner) => (
    <div>
        {data.name}
    </div>
);

const renderProgramName = (data: MunicipalityProgramme) => (
    <div>
        {data.program}
        <ListItem
            values={data.partners}
            valueModifier={renderProgramPartnerName}
            keySelector={progammeKeySelector}
        />
    </div>
);

export class MunicipalityDetailInfo extends React.PureComponent<Props, State>{

    render() {
        const {
            selectedMunicipalityData,
        } = this.props;

        if (!selectedMunicipalityData.id) {
            return (
                <Message className={styles.message}>
                    Data not available
                </Message>
            );
        }

        const {
            hlcitCode,
            type,
            localName,
            programs,
            totalProgramBudget,
            totalNoOfProgrammes,
        } = selectedMunicipalityData;

        return (
            <div className={styles.municipalityDetails}>
                <h4 className={styles.heading}>
                    {localName}
                </h4>
                <Item
                    label="Type"
                    value={type}
                />
                <Item
                    label="HLCIT Code"
                    value={hlcitCode}
                />
                <Item
                    label="Budget"
                    value={totalProgramBudget}
                    valueModifier={renderPound}
                />
                <Item
                    label="Number of Programmes"
                    value={totalNoOfProgrammes}
                    valueModifier={renderNumeral}
                />
                <ListItem
                    label="Program"
                    values={programs}
                    valueModifier={renderProgramName}
                    keySelector={partnerKeySelector}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState, props: Props) => ({
    selectedMunicipalityData: municipalityDataSelector(state, props),
});

export default connect<PropsFromState, OwnProps>(
    mapStateToProps,
)(MunicipalityDetailInfo);
