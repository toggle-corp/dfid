import {
    wsEndpoint,
    Rest,
    commonHeaderForPost,
} from '../config/rest';
import { RestPostBody } from './interface';

export const urlForUsers: string = `${wsEndpoint}/users/`;

export const createParamsForUserRegister = (
    { firstName, lastName, email, password }:
    { firstName: string, lastName: string, email: string, password: string },
): RestPostBody => ({
    method: Rest.POST,
    headers: commonHeaderForPost,
    body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
    }),
});
