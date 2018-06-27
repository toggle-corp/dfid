import createReducerWithMap from '../../../utils/createReducerWithMap';
import {
    DomainData,
    ReducerGroup,
} from '../../interface';

import province from './province';
import programme from './programme';
import sector from './sector';
import country from './country';
import indicator from './indicator';
import glossary from './glossary';
import mapLayer from './mapLayer';
import explore from './explore';

import initialDomainData from '../../initial-state/domainData';

const domainDataReducer: ReducerGroup<DomainData> = {
    ...province,
    ...programme,
    ...sector,
    ...country,
    ...indicator,
    ...mapLayer,
    ...glossary,
    ...explore,
};

export default createReducerWithMap(domainDataReducer, initialDomainData);
