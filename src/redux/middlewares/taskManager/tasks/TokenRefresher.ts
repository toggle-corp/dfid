import { MiddlewareAPI } from 'redux';
import { AbstractTask } from '../Manager';
import {
    RestRequest,
    BgRestBuilder,
} from '../../../../vendor/react-store/utils/rest';
import {
    createParamsForTokenRefresh,
    urlForTokenRefresh,
} from '../../../../rest';
import {
    tokenSelector,
    setAccessTokenAction,
} from '../../../../redux';
import schema from '../../../../schema';
import { RootState } from '../../../../redux/interface';

const REFRESH_TIME = 1000 * 60 * 10;
const REFRESH_CHECK_TIME = 1000;

export default class TokenRefresher implements AbstractTask {
    store: MiddlewareAPI<RootState>;
    refreshTime: number;
    refreshCheckTime?: number;
    refreshTimeoutId?: number;
    lastRefreshTime: number;
    refreshRequest: RestRequest;

    constructor(
        store: MiddlewareAPI<RootState>,
        refreshTime: number = REFRESH_TIME,
        refreshCheckTime: number = REFRESH_CHECK_TIME,
    ) {
        this.store = store;
        this.refreshTime = refreshTime;
        this.refreshCheckTime = refreshCheckTime;

        this.lastRefreshTime = (new Date()).getTime();
    }

    start = () => {
        this.scheduleRefreshCheck();
        return Promise.resolve();
    }

    stop = () => {
        this.clearRefreshCheck();
        return Promise.resolve();
    }

    createRefreshRequest = (store: MiddlewareAPI<RootState>): RestRequest => {
        // NOTE: at this point refresh must be defined
        const state = store.getState();
        const { refresh = '' } = tokenSelector(state);
        const refreshRequest = new BgRestBuilder()
            .url(urlForTokenRefresh)
            .params(() => createParamsForTokenRefresh({ refresh }))
            .success((response: { access: string }) => {
                try {
                    schema.validate(response, 'tokenRefreshResponse');
                    const { access } = response;
                    store.dispatch(setAccessTokenAction(access));

                    // call itself again
                    this.scheduleRefreshCheck();
                } catch (er) {
                    console.error(er);
                }
            })
            .failure((response: object) => {
                console.info('FAILURE:', response);
                // NOTE: this will probably never be called
                // because BgRestBuilder will never stop retrying
                this.scheduleRefreshCheck();
            })
            .fatal((response: object) => {
                console.info('FATAL:', response);
                // NOTE: this will probably never be called
                // because BgRestBuilder will never stop retrying
                this.scheduleRefreshCheck();
            })
            .build();
        return refreshRequest;
    }

    refreshAction = () => {
        this.refreshTimeoutId = undefined;

        const now = (new Date()).getTime();
        const difference = now - this.lastRefreshTime;
        // NOTE: difference can be zero if system time has changed
        if (difference < 0 || difference > this.refreshTime) {
            // console.log('Refreshing now', difference);
            this.lastRefreshTime = now;
        } else {
            // console.log('You shall not pass', difference);
            this.scheduleRefreshCheck();
            // You shall not pass
            return;
        }

        if (this.refreshRequest) {
            this.refreshRequest.stop();
        }
        this.refreshRequest = this.createRefreshRequest(this.store);
        this.refreshRequest.start();
    }

    scheduleRefreshCheck = () => {
        if (this.refreshTimeoutId) {
            console.warn('Refresh is already scheduled. Not re-scheduling.');
            return;
        }
        this.refreshTimeoutId = window.setTimeout(this.refreshAction, this.refreshCheckTime);
    }

    clearRefreshCheck = () => {
        if (this.refreshTimeoutId) {
            window.clearTimeout(this.refreshTimeoutId);
        }
        this.refreshTimeoutId = undefined;
    }

}
