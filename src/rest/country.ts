import {
    wsEndpoint,
    commonHeaderForGet,
} from '../config/rest';

export const urlForCountryData = `${wsEndpoint}/country-data/`;
export const urlForCountryGeoJson = `${wsEndpoint}/geojson/country/`;
export const createParamsForCountryData = () => ({
    ...commonHeaderForGet,
});

export const urlForMunicipalities = `${wsEndpoint}/municipalities/`;
export const createParamsForMunicipalities = () => ({
    ...commonHeaderForGet,
});
