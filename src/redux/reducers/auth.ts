import jwtDecode from 'jwt-decode';

import update from '../../vendor/react-store/utils/immutable-update';
import createReducerWithMap from '../../utils/createReducerWithMap';

import { Auth, Token, ActiveUser, ReducerGroup } from '../interface';
import initialAuthState from '../initial-state/auth';
import schema from '../../schema';

// ACTION-TYPE

export const enum AUTH_ACTION {
    login = 'auth/LOGIN',
    logout = 'auth/LOGOUT',
    authenticate = 'auth/AUTHENTICATE',
    setAccessToken = 'auth/SET_ACCESS_TOKEN',
}

// ACTION-CREATOR

export const loginAction = ({ access, refresh }: Token) => ({
    access,
    refresh,
    type: AUTH_ACTION.login,
});

export const authenticateAction = () => ({
    type: AUTH_ACTION.authenticate,
});

export const logoutAction = () => ({
    type: AUTH_ACTION.logout,
});

export const setAccessTokenAction = (access: string) => ({
    access,
    type: AUTH_ACTION.setAccessToken,
});

// HELPER

const decodeAccessToken = (access: string) => {
    const decodedToken: ActiveUser = jwtDecode(access);
    try {
        schema.validate(decodedToken, 'accessToken');
        return {
            userId: decodedToken.userId,
            username: decodedToken.username,
            displayName: decodedToken.displayName,
            isSuperuser: decodedToken.isSuperuser,
            exp: decodedToken.exp,
        };
    } catch (ex) {
        console.warn(ex);
        return {};
    }
};

// REDUCER

const login = (state: Auth, action: { type: string, access: string, refresh: string}) => {
    const { access, refresh } = action;
    const decodedToken = decodeAccessToken(access);
    const settings = {
        token: { $set: {
            access,
            refresh,
        } },
        activeUser: { $set: decodedToken },
    };
    return update(state, settings);
};

const authenticate = (state: Auth) => {
    const settings = {
        authenticated: { $set: true },
    };
    return update(state, settings);
};

const logout = () => initialAuthState;

const setAccessToken = (state: Auth, action: { type: string, access: string }) => {
    const { access } = action;
    const decodedToken = decodeAccessToken(access);
    const settings = {
        token: { $merge: {
            access,
        } },
        activeUser: { $set: decodedToken },
    };
    return update(state, settings);
};

export const authReducers: ReducerGroup<Auth> = {
    [AUTH_ACTION.login]: login,
    [AUTH_ACTION.authenticate]: authenticate,
    [AUTH_ACTION.logout]: logout,
    [AUTH_ACTION.setAccessToken]: setAccessToken,
};
export default createReducerWithMap(authReducers, initialAuthState);
