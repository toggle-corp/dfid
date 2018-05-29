import { DomainData } from '../interface';

const initialDomainDataState: DomainData = {
    provinces: [],
    provincesData: [],

    programmes: [],
    programmesData: [],

    sectors: [],
    sectorsData: [],

    countriesData: [],

    dashboardFilter: {
        filters: {},
        faramValues: {},
        faramErrors: {},
        pristine: true,
        isHidden: false,
    },

    indicators: [],
    mapLayers: [],
};

export default initialDomainDataState;
