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
}

export interface ProgrammeData {
    id: number;
    program: string;
    programBudget: number;
    description: string;
    programId: number;
}

export interface Province {
    id: number;
    name: string;
}

export interface Programme {
    id: number;
    name: string;
}

export interface Sector {
    id: number;
    name: string;
    code: string;
}
