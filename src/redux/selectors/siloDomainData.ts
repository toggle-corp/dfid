import { createSelector } from 'reselect';
import {
    RootState,
    Province,
    Programme,
    Sector,
    MapLayer,
    Dashboard,
    DashboardFilter,
    DashboardFilterParams,
    DashboardRequestManagerLoadings,
    GeoJSONS,
} from '../interface';
import {
    provincesSelector,
    programmesSelector,
    sectorsSelector,
    mapLayersSelector,
} from './domainData';

// NOTE: Use these to make sure reference don't change
const emptyArray: any[] = [];
const emptyObject: object = {};
const emptyFaram: object = {
    faramValues: {},
    faramErrors: {},
};

export const dashboardSelector = ({ siloDomainData }: RootState): Dashboard => (
    siloDomainData.dashboard || emptyObject as Dashboard
);

export const geoJsonsSelector = ({ siloDomainData }: RootState): GeoJSONS => (
    siloDomainData.geoJsons || emptyObject
);

// Dashboard

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

export const dashboardMapLayersIdSelector = createSelector(
    dashboardFilterSelector,
    filters => filters.mapLayersId || emptyArray as number[],
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

// Dasboard Request Manager Loadings Selector

export const dashboardRequestManagerLoadingSelector = createSelector(
    dashboardSelector,
    dashboard => dashboard.loadings || emptyObject as DashboardRequestManagerLoadings,
);

