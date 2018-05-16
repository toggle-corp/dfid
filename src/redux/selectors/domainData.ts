import { createSelector } from 'reselect';
import {
    RootState,
    Province,
    ProvinceData,
    Programme,
    ProgrammeData,
    Sector,
    CountryData,
    DashboardFilter,
    Indicator,
} from '../interface';

// NOTE: Use these to make sure reference don't change
const emptyArray: object[] = [];
const emptyObject: object = {};
const emptyFaram: object = {
    faramValues: {},
    faramErrors: {},
};

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

export const dashboardFilterSelector = ({ domainData }: RootState): DashboardFilter => (
    domainData.dashboardFilter || emptyFaram
);

export const indicatorsSelector = ({ domainData }: RootState): Indicator[] => (
    domainData.indicators || emptyArray
);

// NOTE: Server sends array of country in which first is always Nepal.
export const countryDataSelector = createSelector(
    countriesDataSelector,
    countriesData =>  countriesData[0] || emptyObject,
);

export const dashboardProvinceSelector = createSelector(
    provincesSelector,
    dashboardFilterSelector,
    (provinces, filter) =>
        provinces.find(province => (
            province.id === filter.faramValues.provinceId),
        ) || emptyObject as Province,
);

export const dashboardProvinceDataSelector = createSelector(
    provincesDataSelector,
    dashboardFilterSelector,
    (provincesData, filter) =>
        provincesData.find(provinceData => (
            provinceData.id === filter.faramValues.provinceId),
        ) || emptyObject as ProvinceData,
);

export const dashboardProgrammeSelector = createSelector(
    programmesSelector,
    dashboardFilterSelector,
    (programmes, filter) =>
        programmes.find(programme => (
            programme.id === filter.faramValues.programmeId),
        ) || emptyObject as Programme,
);

export const dashboardProgrammeDataSelector = createSelector(
    programmesDataSelector,
    dashboardFilterSelector,
    (programmesData, filter) =>
        programmesData.find(programmeData => (
            programmeData.programId === filter.faramValues.programmeId),
        ) || emptyObject as ProgrammeData,
);

export const dashboardSectorSelector = createSelector(
    sectorsSelector,
    dashboardFilterSelector,
    (sectors, filter) =>
        sectors.find(sector => (
            sector.id === filter.faramValues.sectorId),
        ) || emptyObject as Sector,
);
