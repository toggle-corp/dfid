import localforage from 'localforage';
import { createTransform } from 'redux-persist';
import { SiloDomainData } from '../redux/interface';
import update from '../vendor/react-store/utils/immutable-update';

const myTransform = createTransform(
    (inboundState: SiloDomainData) => {
        // NOTE: clears out geoJsons
        const settings = {
            geoJsons: { $set: {} },
        };
        return update(inboundState, settings);
    },
    outBoundState => outBoundState,
    { whitelist: ['siloDomainData'] },
);

const storeConfig = {
    blacklist: ['domainData', 'notify', 'siloDomainData'],
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
