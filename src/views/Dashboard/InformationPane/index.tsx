import React from 'react';
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

import {
    RootState,
    InformationPaneState,
    SetInformationPaneStateAction,
} from '../../../redux/interface';
import {
    informationPaneStateSelector,
    dashboardShowCompareSelector,
    setInformationPaneStateAction,
} from '../../../redux';

import { iconNames } from '../../../constants';

import styles from './styles.scss';

interface OwnProps {
    loadingProvinceData: boolean;
    loadingProgrammeData: boolean;
    loadingSectorData: boolean;
    loadingCountryData: boolean;
    className?: string;
}

interface PropsFromState {
    state: InformationPaneState;
    showCompare: boolean;
}

interface PropsFromDispatch {
    setInformationPaneState(params: SetInformationPaneStateAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State {}

interface Routes {
    province: string;
    programme: string;
    sector: string;
}

interface Views {
    province: object;
    programme: object;
    sector: object;
}

export class InformationPane extends React.PureComponent<Props, State>{
    routes: Routes;
    views: Views;

    constructor(props: Props) {
        super(props);

        this.routes = {
            province: 'Province',
            programme: 'Programme',
            sector: 'Sector',
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
        };
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

    render() {
        const {
            className,
            state: {
                isCollapsed,
                activeTab,
            },
            showCompare,
        } = this.props;

        if (isCollapsed) {
            const classNames = [
                className,
                styles.showInformationButton,
            ];

            return (
                <PrimaryButton
                    className={classNames.join(' ')}
                    onClick={this.handleShowInformationButtonClick}
                    title="Show information pane"
                    iconName={iconNames.informationCircle}
                />
            );
        }

        const classNames = [
            className,
            styles.informationPane,
        ];

        return (
            <div className={classNames.join(' ')}>
                <FixedTabs
                    className={styles.fixedTabs}
                    tabs={this.routes}
                    active={activeTab}
                    onClick={this.handleTabChange}
                >
                    { !showCompare &&
                        <Button
                            title="Collapse information pane"
                            onClick={this.handleCollapseButtonClick}
                            iconName={iconNames.chevronUp}
                            transparent
                        />
                    }
                </FixedTabs>
                <MultiViewContainer
                    active={activeTab}
                    views={this.views}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    state: informationPaneStateSelector(state),
    showCompare: dashboardShowCompareSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setInformationPaneState: (params: SetInformationPaneStateAction) =>
        dispatch(setInformationPaneStateAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(InformationPane);
