import { DomainData } from '../interface';

const initialDomainDataState: DomainData = {
    landingOverviewData: {
        provincesCovered: 7,
        districtReached: 77,
        municipalitiesCovered:756,
        totalProjects: 12,
        totalSectors: 11,
        totalBudget: 4900000,
    },

    glossaryData: [
        {
            id: 1,
            title: 'HDI',
            source: '',
            description: 'Human Development Index',
        },
        {
            id: 2,
            title: 'GDP',
            source: '',
            description: 'Gross Domestic Product',
        },
        {
            id: 3,
            title: 'MPI',
            source: '',
            description: 'Multidimensional Poverty Index',
        },

    ],
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

    mapLayers: [],
};

export default initialDomainDataState;
