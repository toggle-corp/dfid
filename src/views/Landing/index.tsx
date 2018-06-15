import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Redux from 'redux';
import { connect } from 'react-redux';

import { reverseRoute } from '../../vendor/react-store/utils/common';
import Numeral from '../../vendor/react-store/components/View/Numeral';
import HorizontalBar from '../../vendor/react-store/components/Visualization/HorizontalBar';
import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';
import { RestRequest } from '../../vendor/react-store/utils/rest';

import { pathNames } from '../../constants';
import { colorScheme } from '../../config/theme';
import logo from '../../resources/img/logo.png';
// import backgroundImage from '../../resources/img/background2.png';

import {
    RootState,
    ProvinceInfo,
    SetProvincesInfoAction,
} from '../../redux/interface';
import {
    setDashboardProvinceAction,
    setProvincesInfoAction,
    provincesInfoSelector,
} from '../../redux';

import ProvinceInfoGetRequest from './requests/ProvinceInfoGetRequest';

import ProvinceMap from './ProvinceMap';
import Overview from './Overview';
import About from './About';
import Footer from './Footer';

import styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    provincesInfo: ProvinceInfo[];
}
interface PropsFromDispatch {
    setDashboardProvince(provinceId: number): void;
    setProvincesInfo(params: SetProvincesInfoAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State {
    redirectTo?: string;
    loadingProvincesInfo: boolean;
}

export const routeToDashboard = {
    pathname: reverseRoute(pathNames.dashboard),
};

export const routeToExplore = {
    pathname: reverseRoute(pathNames.dashboard),
};

export const routeToGlossary = {
    pathname: reverseRoute(pathNames.glossary),
};

const provinceDataLabelAccessor = (d: ProvinceInfo) => d.name;

const totalSpendValueAccessor = (d: ProvinceInfo) => d.totalBudget;
const totalSpendValueLabelAccessor = (totalBudget: number) => {
    if (totalBudget === null || totalBudget === undefined) {
        return '';
    }
    const num = Numeral.renderText({
        value: totalBudget,
        precision: 2,
        normal: true,
        lang: 'en',
        prefix: '£ ',
        separator: ',',
    });
    return num;
};

const activeProjectValueAccessor = (d: ProvinceInfo) => d.activeProgrammes;

export class Landing extends React.PureComponent<Props, State> {
    provinceInfoRequest: RestRequest;

    constructor(props: Props) {
        super(props);

        this.state = {
            redirectTo: undefined,
            loadingProvincesInfo: true,
        };
    }

    componentWillMount() {
        this.startRequestForProvinceInfo();
    }

    componentWillUnmount() {
        if (this.provinceInfoRequest) {
            this.provinceInfoRequest.stop();
        }
    }

    startRequestForProvinceInfo = () => {
        if (this.provinceInfoRequest) {
            this.provinceInfoRequest.stop();
        }
        const provinceInfoRequest = new ProvinceInfoGetRequest({
            setState: params => this.setState(params),
            setProvincesInfo: this.props.setProvincesInfo,
        });
        this.provinceInfoRequest = provinceInfoRequest.create();
        this.provinceInfoRequest.start();
    }

    handleMapClick = (province: number) => {
        const { setDashboardProvince } = this.props;
        setDashboardProvince(province);
        this.setState({ redirectTo: reverseRoute(pathNames.dashboard) });
    }

    handleMapHover = (province: number) => {
        console.warn(province);
    }

    render() {
        const {
            redirectTo,
            loadingProvincesInfo,
        } = this.state;
        const { provincesInfo } = this.props;
        if (redirectTo) {
            return (
                <Redirect
                    push
                    to={redirectTo}
                />
            );
        }

        return (
            <div className={styles.landing}>
                <div className={styles.header}>
                    <div className={styles.content}>
                        <img
                            className={styles.logo}
                            src={logo}
                        />
                        <div className={styles.menu}>
                            <Link
                                className={styles.link}
                                to={routeToDashboard}
                            >
                                Dashboard
                            </Link>
                            <Link
                                className={styles.link}
                                to={routeToExplore}
                            >
                                Explore
                            </Link>
                            <Link
                                className={styles.link}
                                to={routeToGlossary}
                            >
                                  Glossary
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={styles.body}>
                    <div className={styles.mapSection}>
                        <ProvinceMap
                            onHover={this.handleMapHover}
                            onClick={this.handleMapClick}
                            className={styles.provinceMap}
                            colorScheme={colorScheme}
                        />
                        <Overview />
                    </div>
                    <div className={styles.charts}>
                        {loadingProvincesInfo && <LoadingAnimation />}
                        <div className={styles.chartContainer}>
                            <h3 className={styles.heading}>
                                Total Spend
                            </h3>
                            <HorizontalBar
                                colorScheme={colorScheme}
                                className={styles.chart}
                                data={provincesInfo}
                                labelAccessor={provinceDataLabelAccessor}
                                valueAccessor={totalSpendValueAccessor}
                                valueLabelAccessor={totalSpendValueLabelAccessor}
                            />
                        </div>
                        <div className={styles.chartContainer}>
                            <h3 className={styles.heading}>
                                Active DFID projects
                            </h3>
                            <HorizontalBar
                                colorScheme={colorScheme}
                                className={styles.chart}
                                data={provincesInfo}
                                labelAccessor={provinceDataLabelAccessor}
                                valueAccessor={activeProjectValueAccessor}
                            />
                        </div>
                    </div>
                    <About />
                </div>
                <Footer />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    provincesInfo: provincesInfoSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setDashboardProvince: (provinceId: number) => dispatch(setDashboardProvinceAction(provinceId)),
    setProvincesInfo: (params: SetProvincesInfoAction) => dispatch(setProvincesInfoAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Landing);
