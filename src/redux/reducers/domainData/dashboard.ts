import update from '../../../vendor/react-store/utils/immutable-update';

import {
    DomainData,
    ReducerGroup,

    SetDashboardFilterAction,
} from '../../interface';

// ACTION-TYPE

export const enum DASHBOARD_ACTION {
    setFilters = 'domainData/DASHBOARD/SET_FILTERS',
    setProvince = 'domainData/DASHBOARD/SET_PROVINCE',
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

// REDUCER

const setFilters = (state: DomainData, action: SetDashboardFilterAction) => {
    const {
        filters,
        faramValues,
        faramErrors,
        pristine,
        isHidden,
    } = action;
    const settings = {
        dashboardFilter: {
            filters: { $if: [filters, { $set: filters }] },
            faramValues: { $if: [faramValues, { $set: faramValues }] },
            faramErrors: { $if: [faramErrors, { $set: faramErrors }] },
            isHidden: { $if: [isHidden !== undefined, { $set: isHidden }] },
            pristine: { $if: [pristine !== undefined, { $set: pristine }] },
        },
    };
    return update(state, settings);
};

const setProvince = (state: DomainData, { provinceId }: { provinceId: number }) => {
    const settings = {
        dashboardFilter: {
            faramValues: { $auto: {
                provincesId: { $set: [provinceId] },
            } },
            filters: { $auto: {
                provincesId: { $set: [provinceId] },
            } },
        },
    };
    return update(state, settings);
};


const reducer: ReducerGroup<DomainData> = {
    [DASHBOARD_ACTION.setFilters]: setFilters,
    [DASHBOARD_ACTION.setProvince]: setProvince,
};

export default reducer;
