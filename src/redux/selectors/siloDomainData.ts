import { createSelector } from 'reselect';
import {
    Dashboard,
    DashboardFilter,
    DashboardFilterParams,
    DashboardRequestManagerLoadings,
    GeoJSONS,
    MapLayer,
    Municipality,
    Programme,
    ProgrammeData,
    Province,
    ProvinceData,
    RootState,
    Sector,
    Explore,
} from '../interface';

import {
    provincesSelector,
    provincesDataSelector,
    programmesDataSelector,
    programmesSelector,
    sectorsSelector,
    indicatorsDataSelector,
    municipalityIndicatorsDataSelector,
    mapLayersSelector,
    municipalitiesSelector,
    exploreDataSelector,
    provinceIdFromPropsSelector,
} from '../../redux';

// NOTE: Use these to make sure reference don't change
const emptyArray: any[] = [];
const emptyObject: object = {};
const emptyFaram: object = {
    faramValues: {},
    faramErrors: {},
};

// Selectors
export const dashboardSelector = ({ siloDomainData }: RootState): Dashboard => (
    siloDomainData.dashboard || emptyObject as Dashboard
);

export const geoJsonsSelector = ({ siloDomainData }: RootState): GeoJSONS => (
    siloDomainData.geoJsons || emptyObject
);

export const exploreSelector = ({ siloDomainData }: RootState): Explore => (
    siloDomainData.explore || emptyObject
);

// Dashboard

export const informationPaneStateSelector = createSelector(
    dashboardSelector,
    dashboard => dashboard.informationPaneState,
);

export const dashboardShowCompareSelector = createSelector(
    dashboardSelector,
    dashboard => dashboard.showCompare,
);

export const dashboardFilterPaneSelector = createSelector(
    dashboardSelector,
    dashboard => dashboard.filterPane || emptyObject as DashboardFilter,
);

export const dashboardFilterSelector = createSelector(
    dashboardFilterPaneSelector,
    filterPane => filterPane.filters || emptyFaram as DashboardFilterParams,
);

export const dashboardProvincesIdSelector = createSelector(
    dashboardFilterSelector,
    filters => filters.provincesId || emptyArray as number[],
);

export const dashboardProgrammesIdSelector = createSelector(
    dashboardFilterSelector,
    filters => filters.programmesId || emptyArray as number[],
);

export const dashboardSectorsIdSelector = createSelector(
    dashboardFilterSelector,
    filters => filters.sectorsId || emptyArray as number[],
);

export const dashboardIndicatorIdSelector = createSelector(
    dashboardFilterSelector,
    filters => filters.indicatorId,
);

export const dashboardMunicipalityIndicatorIdSelector = createSelector(
    dashboardFilterSelector,
    filters => filters.municipalityIndicator,
);

export const dashboardMapLayersIdSelector = createSelector(
    dashboardFilterSelector,
    filters => filters.mapLayersId || emptyArray as number[],
);

export const dashboardMunicipalitiesIdSelector = createSelector(
    dashboardFilterSelector,
    filters => filters.municipalitiesId || emptyArray as number[],
);

export const dashboardRasterMapLayerIdSelector = createSelector(
    dashboardFilterSelector,
    filters => filters.rasterMapLayerId,
);

export const dashboardProvincesSelector = createSelector(
    provincesSelector,
    dashboardProvincesIdSelector,
    (provinces, provincesId) =>
        provinces.filter(province => (
            provincesId.findIndex(id => id === province.id)) !== -1,
        ) || emptyArray as Province[],
);

export const dashboardProvincesDataSelector = createSelector(
    provincesDataSelector,
    dashboardProvincesIdSelector,
    (provincesData, provincesId) =>
        provincesData.filter(provinceData => (
            provincesId.findIndex(id => id === provinceData.id)) !== -1,
        ) || emptyArray as ProvinceData[],
);

export const dashboardProgrammesSelector = createSelector(
    programmesSelector,
    dashboardProgrammesIdSelector,
    (programmes, programmesId) =>
        programmes.filter(programme => (
            programmesId.findIndex(id => id === programme.id)) !== -1,
        ) || emptyArray as Programme[],
);

export const dashboardProgrammesDataSelector = createSelector(
    programmesDataSelector,
    dashboardProgrammesIdSelector,
    (programmesData, programmesId) =>
        programmesData.filter(programmeData => (
            programmesId.findIndex(id => id === programmeData.id)) !== -1,
        ) || emptyArray as ProgrammeData[],
);

export const dashboardSectorsSelector = createSelector(
    sectorsSelector,
    dashboardSectorsIdSelector,
    (sectors, sectorsId) =>
        sectors.filter(sector => (
            sectorsId.findIndex(id => id === sector.id)) !== -1,
        ) || emptyArray as Sector[],
);

export const dashboardIndicatorSelector = createSelector(
    indicatorsDataSelector,
    dashboardIndicatorIdSelector,
    (indicatorsData, indicatorId) =>
        (indicatorsData && indicatorId) ? indicatorsData[indicatorId] : undefined,
);

export const dashboardMunicipalityIndicatorSelector = createSelector(
    municipalityIndicatorsDataSelector,
    dashboardMunicipalityIndicatorIdSelector,
    (indicatorsData, indicatorId) => indicatorsData.find(d => String(d.id) === indicatorId),
);

export const dashboardMapLayersSelector = createSelector(
    mapLayersSelector,
    dashboardMapLayersIdSelector,
    (mapLayers, mapLayersId) =>
        mapLayers.filter(mapLayer => (
            mapLayersId.findIndex(id => id === mapLayer.id)) !== -1,
        ) || emptyArray as MapLayer[],
);

export const dashboardRasterMapLayerSelector = createSelector(
    mapLayersSelector,
    dashboardRasterMapLayerIdSelector,
    (mapLayers, mapLayerId) =>
        mapLayers.find(mapLayer => mapLayer.id === mapLayerId),
);

export const dashboardMunicipalitiesSelector = createSelector(
    municipalitiesSelector,
    dashboardMunicipalitiesIdSelector,
    (municipalities, municipalitiesId) =>
        municipalities.filter(municipality => (
            municipalitiesId.findIndex(id => id === municipality.id)) !== -1,
        ) || emptyArray as Municipality[],
);

export const dashboardProvinceMunicipalitiesSelector = createSelector(
    dashboardMunicipalitiesSelector,
    provinceIdFromPropsSelector,
    (municipalities, provinceId) =>
        municipalities.filter(
            municipality => municipality.provinceId === provinceId,
        ) || emptyArray as Municipality[],
);

export const municipalitiesForSelectedProgrammesSelector = createSelector(
    municipalitiesSelector,
    dashboardProgrammesIdSelector,
    (municipalities, programmesId) =>
        programmesId.length ?
            municipalities.filter((muncipality) => {
                if (!muncipality.programs) {
                    return;
                }
                return muncipality.programs.findIndex(program => (
                    programmesId.findIndex(programmeId => (
                        programmeId === program.programId
                    )) !== -1
                )) !== -1;
            })
            : emptyArray as Municipality[],
);

// Dasboard Request Manager Loadings Selector

export const dashboardRequestManagerLoadingSelector = createSelector(
    dashboardSelector,
    dashboard => dashboard.loadings || emptyObject as DashboardRequestManagerLoadings,
);

// Explore

export const selectedExploreDataSelector = createSelector(
    exploreDataSelector,
    exploreSelector,
    (exploreData, { selectedExplore }) => exploreData.find(
        explore => explore.id === selectedExplore,
    ),
);
