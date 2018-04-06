import {
    compose,
    createStore,
    applyMiddleware,
    Middleware,
} from 'redux';

import { createActionSyncMiddleware } from './vendor/react-store/utils/redux-sync.js';

import {
    commonHeaderForPost,
    commonHeaderForGet,
    authorizationHeaderForPost,
} from './config/rest';
import {
    composeWithDevTools,
    EnhancerOptions,
} from 'redux-devtools-extension';
import logger from './redux/middlewares/logger';
import taskManager from './redux/middlewares/taskManager';
import { reducersToSync } from './config/store';
import reducer from './redux/reducers';

const actionSyncer: Middleware = createActionSyncMiddleware(reducersToSync);

// Invoke refresh access token every 10m
const middleware: Middleware[] = [
    logger,
    actionSyncer,
    taskManager,
];

const enhancerOptions: EnhancerOptions = {
};

// Override compose if development mode and redux extension is installed
const overrideCompose = process.env.NODE_ENV === 'development';
const applicableComposer = !overrideCompose
    ? compose
    : composeWithDevTools(enhancerOptions);

const enhancer = applicableComposer(
    applyMiddleware(...middleware),
);

// NOTE: replace undefined with an initialState if required
const store = createStore(reducer, {}, enhancer);

if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line global-require
    const tokenSelector = require('./redux/selectors/auth').tokenSelector;

    let currentAccess: string;
    store.subscribe(() => {
        const prevAccess = currentAccess;
        const token = tokenSelector(store.getState());
        currentAccess = token.access;
        if (prevAccess !== currentAccess) {
            if (currentAccess) {
                commonHeaderForPost.Authorization = `Bearer ${currentAccess}`;
                commonHeaderForGet.Authorization = `Bearer ${currentAccess}`;
                authorizationHeaderForPost.Authorization = `Bearer ${currentAccess}`;
            } else {
                commonHeaderForPost.Authorization = undefined;
                commonHeaderForGet.Authorization = undefined;
                authorizationHeaderForPost.Authorization = undefined;
            }
        }
    });
}

export default store;
