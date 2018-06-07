import createReducerWithMap from '../../../utils/createReducerWithMap';
import {
    SiloDomainData,
    ReducerGroup,
} from '../../interface';

import dashboard from './dashboard';
import geoJson from './geoJson';

import initialSiloDomainData from '../../initial-state/siloDomainData';

const siloDomainDataReducer: ReducerGroup<SiloDomainData> = {
    ...dashboard,
    ...geoJson,
};

export default createReducerWithMap(siloDomainDataReducer, initialSiloDomainData);
