import { RestRequest } from '../vendor/react-store/utils/rest';
import { RestHeader, RestAuthorizationHeader } from '../rest/interface';

// Just an alias for prepareQueryParams
export interface UrlParams {
    [key: string]: (boolean | string | number | (string | number | boolean)[]);
}

export const p: {
    (value: UrlParams): string;
} = RestRequest.prepareUrlParams;

// if client is secure, server must be secure
// else use whatever server is using
const clientProtocol = location.protocol;
const serverProtocol = process.env.REACT_APP_API_HTTPS;
const protocol: (string | undefined) = clientProtocol === 'https:'
    ? 'https'
    : serverProtocol || 'http';

const serverEndpoint = process.env.REACT_APP_API_END;
const url = serverEndpoint || 'dfid.naxa.com.np';

export const wsEndpoint: string  = `${protocol}://${url}/core`;
// export const adminEndpoint: string = `${protocol}://${url}/admin/`;

// Available rest methods
export enum Rest {
    POST = 'POST',
    GET = 'GET',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

// NOTE: These are modified in runtime
export const commonHeaderForPostExternal: RestHeader = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};
export const commonHeaderForPost: RestHeader = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};
export const commonHeaderForGet: RestHeader = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};
export const authorizationHeaderForPost: RestAuthorizationHeader = {
};
