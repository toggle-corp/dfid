import {
    FaramErrors,
} from '../rest/interface';
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
    provinces: Province[];
    provincesData: ProvinceData[];
    programmes: Programme[];
    programmesData: ProgrammeData[];
    sectors: Sector[];
    countriesData: CountryData[];
    dashboardFilter: DashboardFilter;
}

export interface Notify {
    notifications: Notification[];
}

export interface RootState {
    domainData: DomainData;
    auth: Auth;
    notify: Notify;
}

export interface ReducerGroup<T> {
    [key: string]: ((state: T, action: object) => T);
}

// Dashboard
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
    provinceId?: number;
    programmeId?: number;
    sectorId?: number;
}

export interface DashboardFilter {
    faramValues: DashboardFilterParams;
    faramErrors: FaramErrors;
}

export type SetDashboardFilterAction = Partial<DashboardFilter>;
