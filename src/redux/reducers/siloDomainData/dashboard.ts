import update from '../../../vendor/react-store/utils/immutable-update';
import initialSiloDomainData from '../../initial-state/siloDomainData';

import {
    SiloDomainData,
    ReducerGroup,

    SetRequestManagerLoadingAction,
    SetDashboardFilterAction,
    SetInformationPaneStateAction,
} from '../../interface';

// ACTION-TYPE

export const enum DASHBOARD_ACTION {
    setFilters = 'siloDomainData/DASHBOARD/SET_FILTERS',
    setProvince = 'siloDomainData/DASHBOARD/SET_PROVINCE',
    setRequestManagerLoading = 'siloDomainData/DASHBOARD/SET_REQUEST_MANAGER_LOADING',
    resetRequestManagerLoading = 'siloDomainData/DASHBOARD/RESET_REQUEST_MANAGER_LOADING',
    toggleProvince = 'siloDomainData/DASHBOARD/TOGGLE_PROVINCE',
    setInformationPaneState = 'siloDomainData/DASHBOARD/INFORMATION_PANE/STATE',
    setDashboardShowCompare = 'siloDomainData/DASHBOARD/SHOW_COMPARE',
}

// ACTION-CREATOR

export const setDashboardFiltersAction = (
    { filters, faramValues, faramErrors, pristine, isHidden }: SetDashboardFilterAction,
) => ({
    filters,
    faramValues,
    faramErrors,
    pristine,
    isHidden,
    type: DASHBOARD_ACTION.setFilters,
});

export const setDashboardProvinceAction = (
    provinceId: number,
) => ({
    provinceId,
    type: DASHBOARD_ACTION.setProvince,
});

export const toggleDashboardProvinceAction = (
    provinceId: number,
) => ({
    provinceId,
    type: DASHBOARD_ACTION.toggleProvince,
});

export const setRequestManagerLoadingAction = (
    loadings: SetRequestManagerLoadingAction,
) => ({
    ...loadings,
    type: DASHBOARD_ACTION.setRequestManagerLoading,
});

export const resetRequestManagerLoadingAction = () => ({
    type: DASHBOARD_ACTION.resetRequestManagerLoading,
});

export const setInformationPaneStateAction  = (
    { isCollapsed, activeTab }: SetInformationPaneStateAction,
) => ({
    isCollapsed,
    activeTab,
    type: DASHBOARD_ACTION.setInformationPaneState,
});

export const setDashboardShowCompareAction = (showCompare: boolean) => ({
    showCompare,
    type: DASHBOARD_ACTION.setDashboardShowCompare,
});

// HELPER

const setIfDefined = (data: any) => {
    return { $if: [data !== undefined, { $set: data }] };
};

// REDUCER

const setFilters = (state: SiloDomainData, action: SetDashboardFilterAction) => {
    const {
        filters,
        faramValues,
        faramErrors,
        pristine,
        isHidden,
    } = action;
    const settings = {
        dashboard: { $auto: {
            filterPane: { $auto: {
                filters: setIfDefined(filters),
                faramValues: setIfDefined(faramValues),
                faramErrors: setIfDefined(faramErrors),
                isHidden: setIfDefined(isHidden),
                pristine: setIfDefined(pristine),
            } },
        } },
    };
    return update(state, settings);
};

const setProvince = (state: SiloDomainData, { provinceId }: { provinceId: number }) => {
    const settings = {
        dashboard: { $auto: {
            filterPane: { $auto: {
                faramValues: { $auto: {
                    provincesId: { $set: [provinceId] },
                } },
                filters: { $auto: {
                    provincesId: { $set: [provinceId] },
                } },
            } },
        } },
    };
    return update(state, settings);
};

const toggleProvince = (state: SiloDomainData, { provinceId }: { provinceId: number }) => {
    const settings = {
        dashboard: { $auto: {
            filterPane: { $auto: {
                faramValues: { $auto: {
                    provincesId: { $autoArray: { $toggleElement: provinceId } },
                } },
                filters: { $auto: {
                    provincesId: { $autoArray: { $toggleElement: provinceId } },
                } },
            } },
        } },
    };
    return update(state, settings);
};

const setRequestManagerLoading = (
    state: SiloDomainData, action: SetRequestManagerLoadingAction,
) => {
    const {
        loadingCountryData,
        loadingProvinceData,
        loadingProgrammeData,
        loadingSectorData,
        loadingProvinces,
        loadingProgrammes,
        loadingSectors,
        loadingIndicators,
        loadingIndicatorsData,
        loadingGeoJson,
        loadingLayers,
        loadingMunicipalities,
    } = action;
    const settings = {
        dashboard: { $auto: {
            loadings: { $auto: {
                loadingCountryData: setIfDefined(loadingCountryData),
                loadingProvinceData: setIfDefined(loadingProvinceData),
                loadingProgrammeData: setIfDefined(loadingProgrammeData),
                loadingSectorData: setIfDefined(loadingSectorData),
                loadingProvinces: setIfDefined(loadingProvinces),
                loadingProgrammes: setIfDefined(loadingProgrammes),
                loadingSectors: setIfDefined(loadingSectors),
                loadingIndicators: setIfDefined(loadingIndicators),
                loadingIndicatorsData: setIfDefined(loadingIndicatorsData),
                loadingGeoJson: setIfDefined(loadingGeoJson),
                loadingLayers: setIfDefined(loadingLayers),
                loadingMunicipalities: setIfDefined(loadingMunicipalities),
            } },
        } },
    };
    return update(state, settings);
};

const resetRequestManagerLoading = (state: SiloDomainData) => {
    const settings = {
        dashboard: { $auto: {
            loadings: {
                $set: initialSiloDomainData.dashboard.loadings,
            },
        } },
    };
    return update(state, settings);
};

const setDashboardShowCompare = (
    state: SiloDomainData, { showCompare }: { showCompare: boolean },
) => {
    const settings = {
        dashboard: { $auto: {
            showCompare: setIfDefined(showCompare),
        } },
    };
    return update(state, settings);
};

const setInformationPaneState = (
    state: SiloDomainData, { isCollapsed, activeTab }: SetInformationPaneStateAction,
) => {
    const settings = {
        dashboard: { $auto: {
            informationPaneState: { $auto: {
                isCollapsed: setIfDefined(isCollapsed),
                activeTab: setIfDefined(activeTab),
            } },
        } },
    };
    return update(state, settings);
};

const reducer: ReducerGroup<SiloDomainData> = {
    [DASHBOARD_ACTION.setFilters]: setFilters,
    [DASHBOARD_ACTION.setProvince]: setProvince,
    [DASHBOARD_ACTION.toggleProvince]: toggleProvince,
    [DASHBOARD_ACTION.setRequestManagerLoading]: setRequestManagerLoading,
    [DASHBOARD_ACTION.resetRequestManagerLoading]: resetRequestManagerLoading,
    [DASHBOARD_ACTION.setInformationPaneState]: setInformationPaneState,
    [DASHBOARD_ACTION.setDashboardShowCompare]: setDashboardShowCompare,
};

export default reducer;
