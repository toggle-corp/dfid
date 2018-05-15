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
    },
};

export default initialDomainDataState;
