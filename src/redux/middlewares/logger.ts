import { Middleware, Dispatch, Action } from 'redux';

// eslint-disable-next-line no-unused-vars
const logger: Middleware = <S>() => (next: Dispatch<S>) => <A extends Action>(action: A): A => {
    if (action) {
        console.info(`DISPATCHING ${action.type}`);
    }
    return next(action);
};

export default logger;
