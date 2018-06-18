import update from '../../../vendor/react-store/utils/immutable-update';

import {
    DomainData,
    ReducerGroup,

    SetCountriesDataAction,
    SetMunicipalitiesAction,
} from '../../interface';

// ACTION-TYPE

export const enum COUNTRY_ACTION {
    setCountriesData = 'domainData/COUNTRY/SET_COUNTRIES_DATA',
    setMunicipalities = 'domainData/COUNTRY/SET_MUNICIPALITIES',
}

// ACTION-CREATOR

export const setCountriesDataAction = (
    { countriesData }: SetCountriesDataAction,
) => ({
    countriesData,
    type: COUNTRY_ACTION.setCountriesData,
});

export const setMunicipalitiesAction = (
    { municipalities }: SetMunicipalitiesAction,
) => ({
    municipalities,
    type: COUNTRY_ACTION.setMunicipalities,
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

const setMunicipalities = (state: DomainData, action: SetMunicipalitiesAction) => {
    const { municipalities } = action;
    const settings = {
        municipalities: {
            $set: municipalities,
        },
    };
    return update(state, settings);
};


const reducer: ReducerGroup<DomainData> = {
    [COUNTRY_ACTION.setCountriesData]: setCountriesData,
    [COUNTRY_ACTION.setMunicipalities]: setMunicipalities,
};

export default reducer;
