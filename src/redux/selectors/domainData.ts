import { createSelector } from 'reselect';
import {
    CountryData,
    Dictionary,
    Indicator,
    IndicatorData,
    LandingOverviewData,
    MapLayer,
    Municipality,
    Programme,
    ProgrammeData,
    ProgrammeDatum,
    Province,
    ProvinceData,
    ProvinceDatum,
    ProvinceInfo,
    RootState,
    Sector,
    SectorData,
    SectorDatum,
} from '../interface';

// NOTE: Use these to make sure reference don't change
const emptyArray: any[] = [];
const emptyObject: object = {};

const provinceIdFromPropsSelector = (
    state: RootState, props: { datum: ProvinceDatum },
) => (props.datum.id);

const programmeIdFromPropsSelector = (
    state: RootState, props: { datum: ProgrammeDatum },
) => (props.datum.id);

const sectorIdFromPropsSelector = (
    state: RootState, props: { datum: SectorDatum },
) => (props.datum.id);

export const landingOverviewDataSelector = ({ domainData }: RootState): LandingOverviewData => (
    domainData.landingOverviewData
);

export const provincesSelector = ({ domainData }: RootState): Province[] => (
    domainData.provinces || emptyArray
);

export const provincesDataSelector = ({ domainData }: RootState): ProvinceData[] => (
    domainData.provincesData || emptyArray
);

export const provincesInfoSelector = ({ domainData }: RootState): ProvinceInfo[] => (
    domainData.provincesInfo || emptyArray
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

export const municipalitiesSelector = ({ domainData }: RootState): Municipality[] => (
    domainData.municipalities || emptyArray
);

export const indicatorsSelector = ({ domainData }: RootState): Indicator[] => (
    domainData.indicators || emptyArray
);

export const indicatorsDataSelector = ({ domainData }: RootState): Dictionary<IndicatorData> => (
    domainData.indicatorsData || emptyObject
);

export const mapLayersSelector = ({ domainData }: RootState): MapLayer[] => (
    domainData.mapLayers || emptyArray
);

// NOTE: Server sends array of country in which first is always Nepal.
export const countryDataSelector = createSelector(
    countriesDataSelector,
    countriesData =>  countriesData[0] || emptyObject,
);

export const validMapLayersSelector = createSelector(
    mapLayersSelector,
    mapLayers => (
        mapLayers.filter(mapLayer => mapLayer.type !== 'Raster' && mapLayer.file)
    ),
);

export const validRasterMapLayersSelector = createSelector(
    mapLayersSelector,
    mapLayers => (
        mapLayers.filter(mapLayer => mapLayer.type === 'Raster' && mapLayer.layerServerUrl)
    ),
);


// Dashboard
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
