import { createSelector } from 'reselect';
import {
    RootState,
    Province,
    ProvinceData,
    Programme,
    ProgrammeData,
    Sector,
    CountryData,
} from '../interface';

// NOTE: Use these to make sure reference don't change
const emptyArray: object[] = [];
const emptyObject: object = {};

export const provincesSelector = ({ domainData }: RootState): Province[] => (
    domainData.provinces || emptyArray
);

export const provincesDataSelector = ({ domainData }: RootState): ProvinceData[] => (
    domainData.provincesData || emptyArray
);

export const programmesSelector = ({ domainData }: RootState): Programme[] => (
    domainData.programmes || emptyArray
);

export const programmesDataSelector = ({ domainData }: RootState): ProgrammeData[] => (
    domainData.programmesData || emptyArray
);

export const sectorsSelector = ({ domainData }: RootState): Sector[] => (
    domainData.sectors || emptyArray
);

export const countriesDataSelector = ({ domainData }: RootState): CountryData[] => (
    domainData.countriesData || emptyArray
);

// NOTE: Server sends array of country in which first is always Nepal.
export const countryDataSelector = createSelector(
    countriesDataSelector,
    countriesData =>  countriesData[0] || emptyObject,
);
