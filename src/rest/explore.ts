import {
    wsEndpoint,
    commonHeaderForGet,
} from '../config/rest';

export const urlForExploreData = `${wsEndpoint}/explore/`;
export const createParamsForExploreData = () => ({
    ...commonHeaderForGet,
});

