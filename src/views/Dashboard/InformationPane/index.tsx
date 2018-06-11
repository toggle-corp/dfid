import React from 'react';

import Button from '../../../vendor/react-store/components/Action/Button';
import PrimaryButton from '../../../vendor/react-store/components/Action/Button/PrimaryButton';
import FixedTabs from '../../../vendor/react-store/components/View/FixedTabs';
import MultiViewContainer from '../../../vendor/react-store/components/View/MultiViewContainer';

import CountryDetailInfo from './CountryDetailInfo';
import MultiProgrammeDetailInfo from './MultiProgrammeDetailInfo';
import MultiProvinceDetailInfo from './MultiProvinceDetailInfo';
import MultiSectorDetailInfo from './MultiSectorDetailInfo';

import { iconNames } from '../../../constants';

import styles from './styles.scss';

interface Props {
    loadingProvinceData: boolean;
    loadingProgrammeData: boolean;
    loadingSectorData: boolean;
    loadingCountryData: boolean;
    className?: string;
}

interface State {
    isCollapsed: boolean;
    activeTab: string;
}

interface Routes {
    province: string;
    programme: string;
    sector: string;
    country: string;
}

interface Views {
    province: object;
    programme: object;
    sector: object;
    country: object;
}

export default class InformationPane extends React.PureComponent<Props, State>{
    routes: Routes;
    views: Views;

    constructor(props: Props) {
        super(props);

        this.state = {
            isCollapsed: true,
            activeTab: 'province',
        };

        this.routes = {
            province: 'Province',
            programme: 'Programme',
            sector: 'Sector',
            country: 'Country',
        };

        this.views = {
            province: {
                component: () => (
                    <MultiProvinceDetailInfo loading={this.props.loadingProvinceData} />
                ),
            },

            programme: {
                component: () => (
                    <MultiProgrammeDetailInfo loading={this.props.loadingProgrammeData} />
                ),
            },

            sector: {
                component: () => (
                    <MultiSectorDetailInfo loading={this.props.loadingSectorData} />
                ),
            },

            country: {
                component: () => (
                    <CountryDetailInfo loading={this.props.loadingCountryData} />
                ),
            },
        };
    }

    handleCollapseButtonClick = () => {
        this.setState({ isCollapsed: true });
    }

    handleShowInformationButtonClick = () => {
        this.setState({ isCollapsed: false });
    }

    handleTabChange = (tab: string) => {
        this.setState({ activeTab: tab });
    }

    render() {
        const { className } = this.props;
        const {
            isCollapsed,
            activeTab,
        } = this.state;

        const classNames = [
            className,
            styles.informationPane,
        ];

        if (isCollapsed) {
            return (
                <PrimaryButton
                    className={styles.showInformationButton}
                    onClick={this.handleShowInformationButtonClick}
                    title="Show information pane"
                    iconName={iconNames.informationCircle}
                />
            );
        }

        return (
            <div className={classNames.join(' ')}>
                <FixedTabs
                    className={styles.fixedTabs}
                    tabs={this.routes}
                    active={activeTab}
                    onClick={this.handleTabChange}
                >
                    <Button
                        title="Collapse information pane"
                        onClick={this.handleCollapseButtonClick}
                        iconName={iconNames.chevronUp}
                        transparent
                    />
                </FixedTabs>
                <MultiViewContainer
                    active={activeTab}
                    views={this.views}
                />
            </div>
        );
    }
}
