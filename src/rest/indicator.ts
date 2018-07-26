import {
    wsEndpoint,
    commonHeaderForGet,
} from '../config/rest';

export const urlForIndicators = `${wsEndpoint}/indicators/`;
export const createUrlForIndicator = (id: number) => `${wsEndpoint}/indicators/${id}/`;

export const urlForIndicatorsData = `${wsEndpoint}/indicator-data/`;
export const createUrlForIndicatorData = (id: number) => `${wsEndpoint}/indicator-data/${id}/`;

export const urlForMunicipalityIndicatorsData = `${wsEndpoint}/poverty-literacy/`;

export const createParamsForIndicators = () => ({
    ...commonHeaderForGet,
});

export const createParamsForIndicatorsData = () => ({
    ...commonHeaderForGet,
});

export const createParamsForMunicipalityIndicatorsData = () => ({
    ...commonHeaderForGet,
});
