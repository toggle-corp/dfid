import update from '../../../vendor/react-store/utils/immutable-update';

import {
    DomainData,
    ReducerGroup,

    SetProvincesAction,
    SetProvincesDataAction,
} from '../../interface';

// ACTION-TYPE

export const enum PROVINCE_ACTION {
    setProvinces = 'domainData/PROVINCE/SET_PROVINCES',
    setProvincesData = 'domainData/PROVINCE/SET_PROVINCES_DATA',
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


const reducer: ReducerGroup<DomainData> = {
    [PROVINCE_ACTION.setProvinces]: setProvinces,
    [PROVINCE_ACTION.setProvincesData]: setProvincesData,
};

export default reducer;
