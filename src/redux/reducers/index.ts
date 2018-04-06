import { persistCombineReducers } from 'redux-persist';

import authReducer from './auth';
import domainDataReducer from './domainData';
import notifyReducer from './notify';

import storeConfig from '../../config/store';

const reducers = {
    auth: authReducer,
    domainData: domainDataReducer,
    notify: notifyReducer,
};
export default persistCombineReducers(storeConfig, reducers);
