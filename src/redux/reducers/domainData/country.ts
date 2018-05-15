import update from '../../../vendor/react-store/utils/immutable-update';

import {
    DomainData,
    ReducerGroup,

    SetCountriesDataAction,
} from '../../interface';

// ACTION-TYPE

export const enum COUNTRY_ACTION {
    setCountriesData = 'domainData/COUNTRY/SET_COUNTRIES_DATA',
}

// ACTION-CREATOR

export const setCountriesDataAction = (
    { countriesData }: SetCountriesDataAction,
) => ({
    countriesData,
    type: COUNTRY_ACTION.setCountriesData,
});

// REDUCER

const setCountriesData = (state: DomainData, action: SetCountriesDataAction) => {
    const { countriesData } = action;
    const settings = {
        countriesData: {
            $set: countriesData,
        },
    };
    return update(state, settings);
};


const reducer: ReducerGroup<DomainData> = {
    [COUNTRY_ACTION.setCountriesData]: setCountriesData,
};

export default reducer;
