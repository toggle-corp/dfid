import {
    wsEndpoint,
    commonHeaderForGet,
} from '../config/rest';

export const urlForProvinceData = `${wsEndpoint}/province-data/`;
export const createParamsForProvinceData = () => ({
    ...commonHeaderForGet,
});

export const urlForProvinces = `${wsEndpoint}/provinces/`;
export const createParamsForProvinces = () => ({
    ...commonHeaderForGet,
});

export const createUrlForProvinceGeoJson = (provinceId: number) => (
    `${wsEndpoint}/geojson/province/${provinceId}/`
);
export const urlForCountryGeoJson = `${wsEndpoint}/geojson/country/`;