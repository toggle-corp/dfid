import React, { Fragment } from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import Button from '../../../vendor/react-store/components/Action/Button';
import PrimaryButton from '../../../vendor/react-store/components/Action/Button/PrimaryButton';
import FixedTabs from '../../../vendor/react-store/components/View/FixedTabs';
import MultiViewContainer from '../../../vendor/react-store/components/View/MultiViewContainer';

import MultiProgrammeDetailInfo from './MultiProgrammeDetailInfo';
import CompareProgrammeDetailInfo from './CompareProgrammeDetailInfo';
import MultiProvinceDetailInfo from './MultiProvinceDetailInfo';
import CompareProvinceDetailInfo from './CompareProvinceDetailInfo';
import MultiSectorDetailInfo from './MultiSectorDetailInfo';
import MultiMunicipalityDetailInfo from './MultiMunicipalityDetailInfo';
import CompareMunicipalityDetailInfo from './CompareMunicipalityDetailInfo';

import {
    RootState,
    InformationPaneState,
    SetInformationPaneStateAction,
} from '../../../redux/interface';
import {
    informationPaneStateSelector,
    dashboardShowCompareSelector,
    setInformationPaneStateAction,
    setDashboardShowCompareAction,
} from '../../../redux';

import { iconNames } from '../../../constants';

import styles from './styles.scss';

interface OwnProps {
    loadingProvinceData: boolean;
    loadingProgrammeData: boolean;
    loadingSectorData: boolean;
    loadingCountryData: boolean;
    loadingMunicipalities: boolean;
    className?: string;
}

interface PropsFromState {
    uiState: InformationPaneState;
    showCompare: boolean;
}

interface PropsFromDispatch {
    setInformationPaneState(params: SetInformationPaneStateAction): void;
    setDashboardShowCompare(showBoolean: boolean): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State {}

interface Routes {
    province: string;
    programme: string;
    sector: string;
    municipality: string;
}

interface Views {
    province: object;
    programme: object;
    sector: object;
    municipality: object;
}

export class InformationPane extends React.PureComponent<Props, State>{
    routes: Routes;
    views: Views;

    constructor(props: Props) {
        super(props);

        this.routes = {
            province: 'Province',
            sector: 'Sector',
            programme: 'Programme',
            municipality: 'Municipality',
        };

        this.views = {
            province: {
                component: () => (
                    this.props.showCompare ?
                    <CompareProvinceDetailInfo loading={this.props.loadingProvinceData} />
                    : <MultiProvinceDetailInfo loading={this.props.loadingProvinceData} />
                ),
            },

            programme: {
                component: () => (
                    this.props.showCompare ?
                    <CompareProgrammeDetailInfo loading={this.props.loadingProgrammeData} />
                    : <MultiProgrammeDetailInfo loading={this.props.loadingProgrammeData} />
                ),
            },

            sector: {
                component: () => (
                    <MultiSectorDetailInfo loading={this.props.loadingSectorData} />
                ),
            },

            municipality: {
                component: () => (
                    this.props.showCompare ?
                    <CompareMunicipalityDetailInfo loading={this.props.loadingMunicipalities} />
                    : <MultiMunicipalityDetailInfo loading={this.props.loadingMunicipalities} />
                ),
            },
        };
    }

    getClassName = () => {
        const {
            className,
            uiState: {
                isCollapsed,
            },
            showCompare,
        } = this.props;

        const classNames = [
            className,
            styles.informationPane,
        ];

        if (isCollapsed) {
            classNames.push(styles.collapsed);
        }

        if (showCompare) {
            classNames.push(styles.showCompare);
        }

        return classNames.join(' ');
    }

    handleCollapseButtonClick = () => {
        this.props.setInformationPaneState({ isCollapsed: true });
    }

    handleShowInformationButtonClick = () => {
        this.props.setInformationPaneState({ isCollapsed: false });
    }

    handleTabChange = (tab: string) => {
        this.props.setInformationPaneState({ activeTab: tab });
    }

    handleToggleCompareButtonClick = () => {
        this.props.setDashboardShowCompare(!this.props.showCompare);
    }

    renderShowInformationButton = () => {
        const {
            uiState: {
                isCollapsed,
            },
        } = this.props;

        if (!isCollapsed) {
            return null;
        }

        return (
            <PrimaryButton
                className={styles.showInformationButton}
                onClick={this.handleShowInformationButtonClick}
                title="Show information pane"
                iconName={iconNames.informationCircle}
            />
        );
    }

    renderInformation = () => {
        const {
            uiState: {
                isCollapsed,
                activeTab,
            },
            showCompare,
        } = this.props;

        if (isCollapsed) {
            return null;
        }

        return (
            <div className={styles.information}>
                <FixedTabs
                    className={styles.fixedTabs}
                    tabs={this.routes}
                    active={activeTab}
                    onClick={this.handleTabChange}
                >
                    <Fragment>
                        <Button
                            onClick={this.handleToggleCompareButtonClick}
                            iconName={showCompare ? iconNames.list : iconNames.grid}
                            title={showCompare ? 'Show list' : 'Show Comparision'}
                            transparent
                        />
                        <Button
                            title="Collapse information pane"
                            onClick={this.handleCollapseButtonClick}
                            iconName={iconNames.chevronUp}
                            transparent
                        />
                    </Fragment>
                </FixedTabs>
                <MultiViewContainer
                    active={activeTab}
                    views={this.views}
                />
            </div>
        );
    }

    render() {
        // tslint:disable-next-line variable-name
        const ShowInformationButton = this.renderShowInformationButton;

        // tslint:disable-next-line variable-name
        const Information = this.renderInformation;

        const className = this.getClassName();

        return (
            <div className={className}>
                <ShowInformationButton />
                <Information />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    uiState: informationPaneStateSelector(state),
    showCompare: dashboardShowCompareSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setInformationPaneState: (params: SetInformationPaneStateAction) =>
        dispatch(setInformationPaneStateAction(params)),
    setDashboardShowCompare: (showCompare: boolean) =>
        dispatch(setDashboardShowCompareAction(showCompare)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(InformationPane);
