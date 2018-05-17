import createReducerWithMap from '../../../utils/createReducerWithMap';
import {
    DomainData,
    ReducerGroup,
} from '../../interface';

import province from './province';
import programme from './programme';
import sector from './sector';
import country from './country';
import dashboard from './dashboard';
import indicator from './indicator';
import mapLayer from './mapLayer';

import initialDomainData from '../../initial-state/domainData';

const domainDataReducer: ReducerGroup<DomainData> = {
    ...province,
    ...programme,
    ...sector,
    ...country,
    ...dashboard,
    ...indicator,
    ...mapLayer,
};

export default createReducerWithMap(domainDataReducer, initialDomainData);
