import {
    wsEndpoint,
    commonHeaderForGet,
} from '../config/rest';

export const urlForGlossaryData = `${wsEndpoint}/glossary-data/`;
export const createParamsForGlossaryData = () => ({
    ...commonHeaderForGet,
});

