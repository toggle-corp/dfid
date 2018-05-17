import {
    wsEndpoint,
    commonHeaderForGet,
} from '../config/rest';

export const urlForIndicators = `${wsEndpoint}/indicators/`;
export const createUrlForIndicator = (id: number) => `${wsEndpoint}/indicators/${id}/`;

export const createParamsForIndicators = () => ({
    ...commonHeaderForGet,
});
