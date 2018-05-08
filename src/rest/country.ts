import {
    wsEndpoint,
    commonHeaderForGet,
} from '../config/rest';

export const urlForCountryData = `${wsEndpoint}/country-data/`;
export const createParamsForCountryData = () => ({
    ...commonHeaderForGet,
});

