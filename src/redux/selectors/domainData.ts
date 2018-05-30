import { createSelector } from 'reselect';
import {
    RootState,
    Province,
    ProvinceData,
    Programme,
    ProgrammeData,
    Sector,
    SectorData,
    CountryData,
    DashboardFilter,
    Indicator,
    MapLayer,
    ProvinceDatum,
    ProgrammeDatum,
    SectorDatum,
} from '../interface';

// NOTE: Use these to make sure reference don't change
const emptyArray: any[] = [];
const emptyObject: object = {};
const emptyFaram: object = {
    faramValues: {},
    faramErrors: {},
};

const provinceIdFromPropsSelector = (
    state: RootState, props: { datum: ProvinceDatum },
) => (props.datum.id);

const programmeIdFromPropsSelector = (
    state: RootState, props: { datum: ProgrammeDatum },
) => (props.datum.id);

const sectorIdFromPropsSelector = (
    state: RootState, props: { datum: SectorDatum },
) => (props.datum.id);

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

export const sectorsDataSelector = ({ domainData }: RootState): SectorData[] => (
    domainData.sectorsData || emptyArray
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

export const mapLayersSelector = ({ domainData }: RootState): MapLayer[] => (
    domainData.mapLayers || emptyArray
);

// NOTE: Server sends array of country in which first is always Nepal.
export const countryDataSelector = createSelector(
    countriesDataSelector,
    countriesData =>  countriesData[0] || emptyObject,
);

// Dashboard
export const dashboardProvincesIdSelector = createSelector(
    dashboardFilterSelector,
    filter => filter.filters.provincesId || emptyArray as number[],
);

export const dashboardProgrammesIdSelector = createSelector(
    dashboardFilterSelector,
    filter => filter.filters.programmesId || emptyArray as number[],
);

export const dashboardSectorsIdSelector = createSelector(
    dashboardFilterSelector,
    filter => filter.filters.sectorsId || emptyArray as number[],
);

export const dashboardMapLayersIdSelector = createSelector(
    dashboardFilterSelector,
    filter => filter.filters.mapLayersId || emptyArray as number[],
);

export const dashboardProvincesSelector = createSelector(
    provincesSelector,
    dashboardProvincesIdSelector,
    (provinces, provincesId) =>
        provinces.filter(province => (
            provincesId.findIndex(id => id === province.id)) !== -1,
        ) || emptyArray as Province[],
);

export const dashboardProgrammesSelector = createSelector(
    programmesSelector,
    dashboardProgrammesIdSelector,
    (programmes, programmesId) =>
        programmes.filter(programme => (
            programmesId.findIndex(id => id === programme.id)) !== -1,
        ) || emptyArray as Programme[],
);

export const dashboardSectorsSelector = createSelector(
    sectorsSelector,
    dashboardSectorsIdSelector,
    (sectors, sectorsId) =>
        sectors.filter(sector => (
            sectorsId.findIndex(id => id === sector.id)) !== -1,
        ) || emptyArray as Sector[],
);

export const dashboardMapLayersSelector = createSelector(
    mapLayersSelector,
    dashboardMapLayersIdSelector,
    (mapLayers, mapLayersId) =>
        mapLayers.filter(mapLayer => (
            mapLayersId.findIndex(id => id === mapLayer.id)) !== -1,
        ) || emptyArray as MapLayer[],
);

export const provinceDataSelector = createSelector(
    provincesDataSelector,
    provinceIdFromPropsSelector,
    (provincesData, provinceId) =>
        provincesData.find(provinceData => (
            provinceData.id === provinceId),
        ) || emptyObject as ProvinceData,
);

export const programmeDataSelector = createSelector(
    programmesDataSelector,
    programmeIdFromPropsSelector,
    (programmesData, programmeId) =>
        programmesData.find(programmeData => (
            programmeData.id === programmeId),
        ) || emptyObject as ProgrammeData,
);

export const sectorDataSelector = createSelector(
    sectorsDataSelector,
    sectorIdFromPropsSelector,
    (sectorsData, sectorId) =>
        sectorsData.find(sectorData => (
            sectorData.id === sectorId),
        ) || emptyObject as SectorData,
);
