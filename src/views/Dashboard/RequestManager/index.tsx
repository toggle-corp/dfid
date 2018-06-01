import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import { RestRequest } from '../../../vendor/react-store/utils/rest';

import {
    setCountriesDataAction,
    setProvincesAction,
    setProvincesDataAction,
    setProgrammesAction,
    setProgrammesDataAction,
    setSectorsAction,
    setIndicatorsAction,
    setMapLayersAction,
    setRequestManagerLoadingAction,
    dashboardFilterPaneSelector,
} from '../../../redux';

import {
    RootState,
    SetProvincesAction,
    SetProvincesDataAction,
    SetCountriesDataAction,
    SetProgrammesAction,
    SetProgrammesDataAction,
    SetSectorsAction,
    SetIndicatorsAction,
    SetMapLayersAction,
    SetRequestManagerLoadingAction,
    DashboardFilter,
    DashboardFilterParams,
} from '../../../redux/interface';

import CountriesDataGetRequest from './requests/CountriesDataGetRequest';
import IndicatorsGetRequest from './requests/IndicatorsGetRequest';
import MapLayersGetRequest from './requests/MapLayersGetRequest';
import ProgrammesDataGetRequest from './requests/ProgrammesDataGetRequest';
import ProgrammesGetRequest from './requests/ProgrammesGetRequest';
import ProvinceDataGetRequest from './requests/ProvinceDataGetRequest';
import ProvincesGetRequest from './requests/ProvincesGetRequest';
import SectorsGetRequest from './requests/SectorsGetRequest';

interface OwnProps {}
interface PropsFromState {
    faramState: DashboardFilter;
}
interface PropsFromDispatch {
    setCountriesData(params: SetCountriesDataAction): void;
    setProvinces(params: SetProvincesAction): void;
    setProvincesData(params: SetProvincesDataAction): void;
    setProgrammes(params: SetProgrammesAction): void;
    setProgrammesData(params: SetProgrammesDataAction): void;
    setSectors(params: SetSectorsAction): void;
    setIndicators(params: SetIndicatorsAction): void;
    setMapLayers(params: SetMapLayersAction): void;
    setDashboardLoadings(params: SetRequestManagerLoadingAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State { }

const emptyArray: any[] = [];
const sameArraysIgnoreOrder = (a: any[], b: any[]) => {
    if (a.length !== b.length) {
        return;
    }

    for (let i = 0; i < a.length; i += 1) {
        const e1 = a[i];
        if (b.find((e2: any) => e1 !== e2)) {
            return false;
        }
    }

    return true;
};

export class RequestManager extends React.PureComponent<Props, State>{
    countryDataRequest: RestRequest;
    indicatorsRequest: RestRequest;
    mapLayersRequest: RestRequest;
    programmeDataRequest: RestRequest;
    programmeRequest: RestRequest;
    provinceDataRequest: RestRequest;
    provincesRequest: RestRequest;
    sectorRequest: RestRequest;

    componentDidMount() {
        this.startRequestForCountriesData();
        this.startRequestForProvinceData();
        this.startRequestForProvinces();
        this.startRequestForProgrammes();
        this.startRequestForProgrammesData();
        this.startRequestForSectors();
        this.startRequestForIndicators();
        this.startRequestForMapLayers();
    }

    componentWillReceiveProps(nextProps: Props) {
        const { faramState: { filters: oldFilters } } = this.props;
        const { faramState: { filters } } = nextProps;
        if (filters !== oldFilters) {
            this.handleFilterChange(oldFilters, filters);
        }
    }

    componentWillUnmount() {
        if (this.countryDataRequest) {
            this.countryDataRequest.stop();
        }
        if (this.provinceDataRequest) {
            this.provinceDataRequest.stop();
        }
        if (this.provincesRequest) {
            this.provincesRequest.stop();
        }
        if (this.programmeRequest) {
            this.programmeRequest.stop();
        }
        if (this.programmeDataRequest) {
            this.programmeDataRequest.stop();
        }
        if (this.sectorRequest) {
            this.sectorRequest.stop();
        }
        if (this.indicatorsRequest) {
            this.indicatorsRequest.stop();
        }
        if (this.mapLayersRequest) {
            this.mapLayersRequest.stop();
        }
    }

    startRequestForCountriesData = () => {
        if (this.countryDataRequest) {
            this.countryDataRequest.stop();
        }
        const countryDataRequest = new CountriesDataGetRequest({
            setState: params => this.setState(params),
            setCountriesData: this.props.setCountriesData,
            setLoadings: this.props.setDashboardLoadings,
        });
        this.countryDataRequest = countryDataRequest.create();
        this.countryDataRequest.start();
    }

    startRequestForProvinceData = () => {
        if (this.provinceDataRequest) {
            this.provinceDataRequest.stop();
        }
        const provinceDataRequest = new ProvinceDataGetRequest({
            setState: params => this.setState(params),
            setProvincesData: this.props.setProvincesData,
            setLoadings: this.props.setDashboardLoadings,
        });
        this.provinceDataRequest = provinceDataRequest.create();
        this.provinceDataRequest.start();
    }

    startRequestForProvinces = () => {
        if (this.provincesRequest) {
            this.provincesRequest.stop();
        }
        const provincesRequest = new ProvincesGetRequest({
            setState: params => this.setState(params),
            setProvinces: this.props.setProvinces,
            setLoadings: this.props.setDashboardLoadings,
        });
        this.provincesRequest = provincesRequest.create();
        this.provincesRequest.start();
    }

    startRequestForProgrammes = () => {
        if (this.programmeRequest) {
            this.programmeRequest.stop();
        }
        const programmeRequest = new ProgrammesGetRequest({
            setState: params => this.setState(params),
            setProgrammes: this.props.setProgrammes,
            setLoadings: this.props.setDashboardLoadings,
        });
        this.programmeRequest = programmeRequest.create();
        this.programmeRequest.start();
    }

    startRequestForProgrammesData = () => {
        if (this.programmeDataRequest) {
            this.programmeDataRequest.stop();
        }
        const programmeDataRequest = new ProgrammesDataGetRequest({
            setState: params => this.setState(params),
            setProgrammesData: this.props.setProgrammesData,
            setLoadings: this.props.setDashboardLoadings,
        });
        this.programmeDataRequest = programmeDataRequest.create();
        this.programmeDataRequest.start();
    }

    startRequestForSectors = () => {
        if (this.sectorRequest) {
            this.sectorRequest.stop();
        }
        const sectorRequest = new SectorsGetRequest({
            setState: params => this.setState(params),
            setSectors: this.props.setSectors,
            setLoadings: this.props.setDashboardLoadings,
        });
        this.sectorRequest = sectorRequest.create();
        this.sectorRequest.start();
    }

    startRequestForIndicators = () => {
        if (this.indicatorsRequest) {
            this.indicatorsRequest.stop();
        }
        const indicatorsRequest = new IndicatorsGetRequest({
            setState: params => this.setState(params),
            setIndicators: this.props.setIndicators,
            setLoadings: this.props.setDashboardLoadings,
        });
        this.indicatorsRequest = indicatorsRequest.create();
        this.indicatorsRequest.start();
    }

    startRequestForMapLayers = () => {
        if (this.mapLayersRequest) {
            this.mapLayersRequest.stop();
        }
        const mapLayersRequest = new MapLayersGetRequest({
            setState: params => this.setState(params),
            setMapLayers: this.props.setMapLayers,
            setLoadings: this.props.setDashboardLoadings,
        });
        this.mapLayersRequest = mapLayersRequest.create();
        this.mapLayersRequest.start();
    }

    handleFilterChange = (oldValues: DashboardFilterParams, values: DashboardFilterParams) => {
        const {
            provincesId = emptyArray,
            programmesId = emptyArray,
            sectorsId = emptyArray,
            mapLayersId = emptyArray,
        } = values;
        const {
            provincesId: oldProvincesId = emptyArray,
            programmesId: oldProgrammesId = emptyArray,
            sectorsId: oldSectorsId = emptyArray,
            mapLayersId: oldMapLayersId = emptyArray,
        } = oldValues;

        if (!sameArraysIgnoreOrder(oldProvincesId, provincesId)) {
            this.handleProvinceChange(provincesId);
        }
        if (!sameArraysIgnoreOrder(oldProgrammesId, programmesId)) {
            this.handleProgramChange(programmesId);
        }
        if (!sameArraysIgnoreOrder(oldSectorsId, sectorsId)) {
            // window.location.hash = '#/sector';
        }
        if (!sameArraysIgnoreOrder(oldMapLayersId, mapLayersId)) {
            this.handleMapLayerChange(mapLayersId);
        }
    }

    handleProvinceChange = (keys: number[]) => {
        // FIXME: move logic here from dashboard
        console.warn('handleProvinceChange: ', keys);
    }

    handleProgramChange = (keys: number[]) => {
        // FIXME: move logic here from dashboard
        console.warn('handleProgramChange: ', keys);
    }

    handleMapLayerChange = (keys: number[]) => {
        // FIXME: move logic here from dashboard
        console.warn('handleMapLayerChange: ', keys);
    }

    render() {
        return <div />;
    }
}

const mapStateToProps = (state: RootState) => ({
    faramState: dashboardFilterPaneSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setCountriesData: (params: SetCountriesDataAction) => dispatch(setCountriesDataAction(params)),
    setProvinces: (params: SetProvincesAction) => dispatch(setProvincesAction(params)),
    setProvincesData: (params: SetProvincesDataAction) => dispatch(setProvincesDataAction(params)),
    setProgrammes: (params: SetProgrammesAction) => dispatch(setProgrammesAction(params)),
    setProgrammesData: (params: SetProgrammesDataAction) =>
        dispatch(setProgrammesDataAction(params)),
    setSectors: (params: SetSectorsAction) => dispatch(setSectorsAction(params)),
    setIndicators: (params: SetIndicatorsAction) => dispatch(setIndicatorsAction(params)),
    setMapLayers: (params: SetMapLayersAction) => dispatch(setMapLayersAction(params)),
    setDashboardLoadings: (params: SetRequestManagerLoadingAction) =>
        dispatch(setRequestManagerLoadingAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(RequestManager);
