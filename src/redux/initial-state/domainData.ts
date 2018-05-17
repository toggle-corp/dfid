import { DomainData } from '../interface';

const initialDomainDataState: DomainData = {
    provinces: [],
    provincesData: [],

    programmes: [],
    programmesData: [],
    sectors: [],

    countriesData: [],

    dashboardFilter: {
        faramValues: {},
        faramErrors: {},
        isHidden: false,
    },

    indicators: [],
    mapLayers: [],
};

export default initialDomainDataState;
