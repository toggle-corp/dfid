import update from '../../../vendor/react-store/utils/immutable-update';

import {
    DomainData,
    ReducerGroup,

    SetProvincesAction,
    SetProvincesDataAction,
    SetProvincesInfoAction,
} from '../../interface';

// ACTION-TYPE

export const enum PROVINCE_ACTION {
    setProvinces = 'domainData/PROVINCE/SET_PROVINCES',
    setProvincesData = 'domainData/PROVINCE/SET_PROVINCES_DATA',
    setProvincesInfo = 'domainData/PROVINCE/SET_PROVINCES_INFO',
}

// ACTION-CREATOR

export const setProvincesAction = (
    { provinces }: SetProvincesAction,
) => ({
    provinces,
    type: PROVINCE_ACTION.setProvinces,
});

export const setProvincesDataAction = (
    { provincesData }: SetProvincesDataAction,
) => ({
    provincesData,
    type: PROVINCE_ACTION.setProvincesData,
});

export const setProvincesInfoAction = (
    { provincesInfo }: SetProvincesInfoAction,
) => ({
    provincesInfo,
    type: PROVINCE_ACTION.setProvincesInfo,
});

// REDUCER

const setProvinces = (state: DomainData, action: SetProvincesAction) => {
    const { provinces } = action;
    const settings = {
        provinces: {
            $set: provinces,
        },
    };
    return update(state, settings);
};

const setProvincesData = (state: DomainData, action: SetProvincesDataAction) => {
    const { provincesData } = action;
    const settings = {
        provincesData: {
            $set: provincesData,
        },
    };
    return update(state, settings);
};

const setProvincesInfo = (state: DomainData, action: SetProvincesInfoAction) => {
    const { provincesInfo } = action;
    const settings = {
        provincesInfo: {
            $set: provincesInfo.sort((a, b) => b.provinceId - a.provinceId),
        },
    };
    return update(state, settings);
};

const reducer: ReducerGroup<DomainData> = {
    [PROVINCE_ACTION.setProvinces]: setProvinces,
    [PROVINCE_ACTION.setProvincesData]: setProvincesData,
    [PROVINCE_ACTION.setProvincesInfo]: setProvincesInfo,
};

export default reducer;
