import React from 'react';
import { connect } from 'react-redux';

import {
    renderNumeral,
    renderPound,
} from '../../../components/Renderer';

import {
    RootState,
    LandingOverviewData,
} from '../../../redux/interface';
import { landingOverviewDataSelector } from '../../../redux';

import * as styles from '../styles.scss';

interface OwnProps {}
interface PropsFromState {
    overviewData: LandingOverviewData;
}
interface PropsFromDispatch {}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State {}

export class Overview extends React.PureComponent<Props, State> {

    renderOverviewItem = ({ label, value } : { label: string, value: any }) => (
        <div className={styles.item} >
            <div className={styles.value}>
                {value || '-'}
            </div>
            <div className={styles.label}>
                {label}
            </div>
        </div>
    )

    render() {
        const {
            provincesCovered,
            municipalitiesCovered,
            totalProjects,
            totalSectors,
            totalBudget,
        } = this.props.overviewData;

        // tslint:disable-next-line variable-name
        const Item = this.renderOverviewItem;

        return (
            <div className={styles.overview}>
                <h3 className={styles.heading}>
                    Overview
                </h3>
                <div className={styles.content} >
                    <Item
                        label="budget"
                        value={renderPound(totalBudget)}
                    />
                    <Item
                        label="total projects"
                        value={renderNumeral(totalProjects)}
                    />
                    <Item
                        label="total sectors"
                        value={renderNumeral(totalSectors)}
                    />
                    <Item
                        label="provinces"
                        value={renderNumeral(provincesCovered)}
                    />
                    <Item
                        label="municipalities"
                        value={renderNumeral(municipalitiesCovered)}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    overviewData: landingOverviewDataSelector(state),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps,
)(Overview);
