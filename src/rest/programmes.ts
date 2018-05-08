import {
    wsEndpoint,
    commonHeaderForGet,
} from '../config/rest';

export const urlForProgrammeData = `${wsEndpoint}/programme-data/`;
export const createParamsForProgrammeData = () => ({
    ...commonHeaderForGet,
});

export const urlForProgrammes = `${wsEndpoint}/programmes/`;
export const createParamsForProgrammes = () => ({
    ...commonHeaderForGet,
});

