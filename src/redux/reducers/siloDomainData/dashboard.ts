import update from '../../../vendor/react-store/utils/immutable-update';

import {
    SiloDomainData,
    ReducerGroup,

    SetRequestManagerLoadingAction,
    SetDashboardFilterAction,
} from '../../interface';

// ACTION-TYPE

export const enum DASHBOARD_ACTION {
    setFilters = 'siloDomainData/DASHBOARD/SET_FILTERS',
    setProvince = 'siloDomainData/DASHBOARD/SET_PROVINCE',
    setRequestManagerLoading = 'siloDomainData/DASHBOARD/SET_REQUEST_MANAGER_LOADING',
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

export const setRequestManagerLoadingAction = (
    loadings: SetRequestManagerLoadingAction,
) => ({
    ...loadings,
    type: DASHBOARD_ACTION.setRequestManagerLoading,
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
                filters: { $if: [filters, { $set: filters }] },
                faramValues: { $if: [faramValues, { $set: faramValues }] },
                faramErrors: { $if: [faramErrors, { $set: faramErrors }] },
                isHidden: { $if: [isHidden !== undefined, { $set: isHidden }] },
                pristine: { $if: [pristine !== undefined, { $set: pristine }] },
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
        loadingGeoJson,
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
                loadingGeoJson: setIfDefined(loadingGeoJson),
            } },
        } },
    };
    return update(state, settings);
};

const reducer: ReducerGroup<SiloDomainData> = {
    [DASHBOARD_ACTION.setFilters]: setFilters,
    [DASHBOARD_ACTION.setProvince]: setProvince,
    [DASHBOARD_ACTION.setRequestManagerLoading]: setRequestManagerLoading,
};

export default reducer;
