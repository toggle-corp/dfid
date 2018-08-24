import localforage from 'localforage';
import { createTransform } from 'redux-persist';

import { SiloDomainData } from '../redux/interface';
import initialSiloDomainData from '../redux/initial-state/siloDomainData';

import update from '../vendor/react-store/utils/immutable-update';

const myTransform = createTransform(
    (inboundState: SiloDomainData) => {
        const settings = {
            // NOTE: clears out geoJsons
            geoJsons: { $set: {} },
            // NOTE: clears out dashboard.loadings
            dashboard: {
                loadings: {
                    $set: initialSiloDomainData.dashboard.loadings,
                },
            },
        };
        return update(inboundState, settings);
    },
    outBoundState => outBoundState,
    { whitelist: ['siloDomainData'] },
);

const storeConfig = {
    // blacklist: ['domainData', 'notify', 'siloDomainData'],
    key: 'dfid',
    storage: localforage,
    transforms: [myTransform],
};
export default storeConfig;

export const reducersToSync = [
    'auth',
    'domainData',
    'taskManager', // middleware
];
