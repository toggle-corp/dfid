import {
    UrlParams,
    p,
    wsEndpoint,
    commonHeaderForGet,
} from '../config/rest';

export const urlForMapLayers: string = `${wsEndpoint}/layer-data/`;
export const createUrlForMapLayer = (id: number) => `${wsEndpoint}/layer-data/${id}`;

export const createParamsForMapLayers = () => ({
    ...commonHeaderForGet,
});

export const createUrlForTileLayer = (baseUrl: string, params: UrlParams) => (
    `${baseUrl}ows?${p(params)}`
);
