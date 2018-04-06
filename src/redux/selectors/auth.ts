import { RootState, Token, ActiveUser } from '../interface';

const emptyObject = {};

export const tokenSelector = ({ auth }: RootState): Token => (
    auth.token || emptyObject
);
export const activeUserSelector = ({ auth }: RootState): ActiveUser => (
    auth.activeUser || emptyObject
);
export const authenticatedSelector = ({ auth }: RootState): boolean => (
    auth.authenticated
);
