import { FaramErrors } from '../rest/interface';

// FIXME: Move to common interfaces
export type Dictionary<T> = {
    [key: string]: T;
};

export interface Notification {
    type: string;
    title: string;
    message: string;
    dismissable: boolean;
    duration: number;
}

export interface Token {
    access?: string;
    refresh?: string;
    userId?: number;
}

export interface ActiveUser {
    isSuperuser?: boolean;
    userId?: number;
    username?: string;
    displayName?: string;
    exp?: string;
}

export interface Auth {
    token: Token;
    activeUser: ActiveUser;
    authenticated: boolean;
}

export interface DomainData {
    landingOverviewData: LandingOverviewData;
    provinces: Province[];
    provincesData: ProvinceData[];
    provincesInfo: ProvinceInfo[];
    programmes: Programme[];
    programmesData: ProgrammeData[];
    sectors: Sector[];
    sectorsData: SectorData[];
    countriesData: CountryData[];
    indicators: Indicator[];
    indicatorsData: Dictionary<IndicatorData>;
    mapLayers: MapLayer[];
}

export interface SiloDomainData {
    dashboard: Dashboard;
    geoJsons: GeoJSONS;
}

export interface Notify {
    notifications: Notification[];
}

export interface RootState {
    domainData: DomainData;
    siloDomainData: SiloDomainData;
    auth: Auth;
    notify: Notify;
}

export interface ReducerGroup<T> {
    [key: string]: ((state: T, action: object) => T);
}

// Dashboard
export interface Dashboard {
    showCompare: boolean;
    filterPane: DashboardFilter;
    loadings: DashboardRequestManagerLoadings;
    informationPaneState: InformationPaneState;
}

export interface InformationPaneState {
    isCollapsed: boolean;
    activeTab?: string;
}

export interface ProgrammeName {
    programID: number;
    programName: string;
}

export interface ProgrammeSectorName {
    sectorId: number;
    sectorName: string;
}


export interface ProvinceData {
    id: number;
    province: string;
    district: number;
    totalPopulation: number;
    area: number;
    populationDensity: number;
    povertyRate: number;
    populationUnderPovertyLine: number;
    perCapitaIncome: number;
    hhByLowestWealthQuantiles: number;
    humanDevelopmentIndex: number;
    minuteAccessTo: number;
    vulnerabilityIndex: number;
    gdp: number;
    activeProgrammes: ProgrammeName[];
    totalBudget: number;
    description: string;
}

export interface ProvinceInfo {
    id: number;
    provinceId: number;
    name: string;
    activeProgrammes: number;
    totalBudget: number;
}

export interface ProgrammeData {
    id: number;
    program: string;
    programBudget: number;
    description: string;
    programId: number;
    sectors: ProgrammeSectorName[];
}

// Province
export interface Province {
    id: number;
    name: string;
}

export interface SetProvincesAction {
    provinces: Province[];
}

export interface SetProvincesDataAction {
    provincesData: ProvinceData[];
}

export type SetInformationPaneStateAction = Partial<InformationPaneState>;

export interface SetProvincesInfoAction {
    provincesInfo: ProvinceInfo[];
}

// Programme
export interface Programme {
    id: number;
    name: string;
}

export interface SetProgrammesAction {
    programmes: Programme[];
}

export interface SetProgrammesDataAction {
    programmesData: ProgrammeData[];
}

// Sector
export interface Sector {
    id: number;
    name: string;
    code: string;
}

// FIXME: complete this
export type SectorData = Sector;

export interface SetSectorsAction {
    sectors: Sector[];
}

// Country

export interface CountryData {
    id: number;
    provinces: number;
    paalikas: number;
    municipalities: number;
    totalPopulation: number;
    area: number;
    populationDensity: number;
    povertyRate: number;
    literacyRate: number;
    populationUnderPovertyLine: number;
    perCapitaIncome: number;
    humanDevelopmentIndex: number;
    gdp: number;
}

export interface SetCountriesDataAction {
    countriesData: CountryData[];
}

// Dashboard

export interface DashboardFilterParams {
    provincesId?: number[];
    programmesId?: number[];
    sectorsId?: number[];
    indicatorId?: number;
    mapLayersId?: number[];
    rasterMapLayerId?: number;
}

export interface DashboardFilter {
    filters: DashboardFilterParams;
    faramValues: DashboardFilterParams;
    faramErrors: FaramErrors;
    pristine: boolean;
    isHidden: boolean;
}

export type SetDashboardFilterAction = Partial<DashboardFilter>;

// Indicator

export interface Indicator {
    id: number;
    name: string;
}

export interface IndicatorData {
    id: number;
    name: string;
    unit: number;
    provinces: Dictionary<{
        provinceId: number;
        value: number;
    }>;
    minValue: number;
    maxValue: number;
}

export interface SetIndicatorsAction {
    indicators: Indicator[];
}

export interface SetIndicatorsDataAction {
    indicatorsData: Dictionary<IndicatorData>;
}


// Map Layer

export interface MapLayer {
    id: number;
    layerName: string;
    layerServerUrl?: string;
    type: string;
    file: string;
    sectors: { code: string }[];
}

export interface SetMapLayersAction {
    mapLayers: MapLayer[];
}

export interface ProvinceDatum {
    id: number;
}

export interface ProgrammeDatum {
    id: number;
}

export interface SectorDatum {
    id: number;
}

// Request Manager

export interface DashboardRequestManagerLoadings {
    loadingCountryData: boolean;
    loadingProvinceData: boolean;
    loadingProgrammeData: boolean;
    loadingSectorData: boolean;

    loadingProvinces: boolean;
    loadingProgrammes: boolean;
    loadingSectors: boolean;
    loadingIndicators: boolean;
    loadingIndicatorsData: boolean;
    loadingGeoJson: boolean;
    loadingLayers: boolean;
}

export type SetRequestManagerLoadingAction = Partial<DashboardRequestManagerLoadings>;

// Map Layer Properties

export interface MapLayerProps {
    layerKey: string;
    order: number;

    geoJson: GeoJSON;
    style: object;
    idKey?: string;
    labelKey?: string;
    zoomOnLoad?: boolean;
    handleHover?: boolean;
    onClick?(key: String): void;
}

// GeoJSON

export type GeoJSON = any;

export interface GeoJSONS {
    [url: string]: GeoJSON;
}

export type SetGeoJsonsAction = GeoJSONS;

// Landing

export interface LandingOverviewData {
    provincesCovered: number;
    districtReached: number;
    municipalitiesCovered: number;
    totalProjects: number;
    totalSectors: number;
    totalBudget: number;
}
