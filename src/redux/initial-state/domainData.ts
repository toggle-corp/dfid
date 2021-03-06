import { DomainData } from '../interface';

const initialDomainDataState: DomainData = {
    landingOverviewData: {
        provincesCovered: 7,
        districtReached: 77,
        municipalitiesCovered:756,
        totalProjects: 12,
        totalSectors: 11,
        totalBudget: 64400000,
    },

    glossaryData: [],
    exploreData: [],
    provinces: [],
    provincesData: [],
    provincesInfo: [],

    programmes: [],
    programmesData: [],

    sectors: [],
    sectorsData: [],

    countriesData: [],
    municipalities: [],

    indicators: [],
    indicatorsData: {},
    municipalityIndicatorsData: [],

    mapLayers: [],
};

export default initialDomainDataState;
