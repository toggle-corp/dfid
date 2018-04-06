import { MiddlewareAPI, Action } from 'redux';

declare module 'redux' {
    // tslint:disable-next-line no-any
    export interface SpecificMiddleware<T = any> {
        <S>(api: MiddlewareAPI<S>): (next: Dispatch<S>) => Dispatch<S>;
        (api: MiddlewareAPI<T>): (next: Dispatch<T>) => Dispatch<T>;
    }
}
