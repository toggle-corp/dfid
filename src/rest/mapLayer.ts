import {
    wsEndpoint,
    commonHeaderForGet,
} from '../config/rest';

export const urlForMapLayers: string = `${wsEndpoint}/layer-data/`;
export const createUrlForMapLayer = (id: number) => `${wsEndpoint}/layer-data/${id}`;

export const createParamsForMapLayers = () => ({
    ...commonHeaderForGet,
});
