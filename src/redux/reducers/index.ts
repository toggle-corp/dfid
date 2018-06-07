import { persistCombineReducers } from 'redux-persist';

import authReducer from './auth';
import domainDataReducer from './domainData';
import siloDomainDataReducer from './siloDomainData';
import notifyReducer from './notify';

import storeConfig from '../../config/store';

const reducers = {
    auth: authReducer,
    domainData: domainDataReducer,
    siloDomainData: siloDomainDataReducer,
    notify: notifyReducer,
};
export default persistCombineReducers(storeConfig, reducers);
