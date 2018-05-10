import {
    wsEndpoint,
    commonHeaderForGet,
} from '../config/rest';

export const urlForSectors = `${wsEndpoint}/sectors/`;
export const createParamsForSectors = () => ({
    ...commonHeaderForGet,
});

