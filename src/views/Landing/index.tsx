import React from 'react';
import { Redirect } from 'react-router-dom';
import Redux from 'redux';
import { connect } from 'react-redux';

import { reverseRoute } from '../../vendor/react-store/utils/common';
import Numeral from '../../vendor/react-store/components/View/Numeral';
import HorizontalBar from '../../vendor/react-store/components/Visualization/HorizontalBar';
import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';
import { RestRequest } from '../../vendor/react-store/utils/rest';

import { pathNames } from '../../constants';
import { colorScheme } from '../../config/theme';
// import backgroundImage from '../../resources/img/background2.png';

import {
    RootState,
    ProvinceInfo,
    Municipality,
    SetDashboardProvinceAction,
    SetProvincesInfoAction,
    SetMunicipalitiesAction,
} from '../../redux/interface';
import {
    setDashboardProvinceAction,
    setProvincesInfoAction,
    setMunicipalitiesAction,
    provincesInfoSelector,
    municipalitiesSelector,
} from '../../redux';

import ProvinceInfoGetRequest from './requests/ProvinceInfoGetRequest';
import MunicipalitiesGetRequest from './requests/MunicipalitiesGetRequest';

import ProvinceMap from './ProvinceMap';
import Overview from './Overview';
import About from './About';
import Footer from './Footer';

import styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    provincesInfo: ProvinceInfo[];
    municipalities: Municipality[];
}
interface PropsFromDispatch {
    setDashboardProvince(params: SetDashboardProvinceAction): void;
    setProvincesInfo(params: SetProvincesInfoAction): void;
    setMunicipalities(params: SetMunicipalitiesAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State {
    redirectTo?: string;
    loadingProvincesInfo: boolean;
    loadingMunicipalities: boolean;
}

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
    municipalitiesRequest: RestRequest;
    provinceInfoRequest: RestRequest;

    constructor(props: Props) {
        super(props);

        this.state = {
            redirectTo: undefined,
            loadingProvincesInfo: true,
            loadingMunicipalities: true,
        };
    }

    componentWillMount() {
        this.startRequestForProvinceInfo();
        this.startRequestForMunicipalities();
    }

    componentWillUnmount() {
        if (this.provinceInfoRequest) {
            this.provinceInfoRequest.stop();
        }
        if (this.municipalitiesRequest) {
            this.municipalitiesRequest.stop();
        }
    }

    startRequestForMunicipalities = () => {
        if (this.municipalitiesRequest) {
            this.municipalitiesRequest.stop();
        }
        const municipalitiesRequest = new MunicipalitiesGetRequest({
            setState: params => this.setState(params),
            setMunicipalities: this.props.setMunicipalities,
        });
        this.municipalitiesRequest = municipalitiesRequest.create();
        this.municipalitiesRequest.start();
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

    handleMapClick = (provinceId: number) => {
        const { setDashboardProvince, municipalities } = this.props;
        setDashboardProvince({
            provinceId,
            municipalities,
        });
        this.setState({ redirectTo: reverseRoute(pathNames.dashboard) });
    }

    handleMapHover = (province: number) => {
        // console.warn(province);
    }

    render() {
        const {
            redirectTo,
            loadingProvincesInfo,
            loadingMunicipalities,
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
                        {(loadingProvincesInfo || loadingMunicipalities) && <LoadingAnimation />}
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
    municipalities: municipalitiesSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setDashboardProvince: (params: SetDashboardProvinceAction) =>
        dispatch(setDashboardProvinceAction(params)),
    setProvincesInfo: (params: SetProvincesInfoAction) => dispatch(setProvincesInfoAction(params)),
    setMunicipalities: (params: SetMunicipalitiesAction) =>
        dispatch(setMunicipalitiesAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Landing);
