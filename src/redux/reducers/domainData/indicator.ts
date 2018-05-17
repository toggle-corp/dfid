import update from '../../../vendor/react-store/utils/immutable-update';

import {
    DomainData,
    ReducerGroup,

    SetIndicatorsAction,
} from '../../interface';

// ACTION-TYPE

export const enum INDICATOR_ACTION {
    setIndicators = 'domainData/INDICATOR/SET_INDICATORS',
}

// ACTION-CREATOR

export const setIndicatorsAction = (
    { indicators }: SetIndicatorsAction,
) => ({
    indicators,
    type: INDICATOR_ACTION.setIndicators,
});

// REDUCER

const setIndicators = (state: DomainData, action: SetIndicatorsAction) => {
    const { indicators } = action;
    const settings = {
        indicators: {
            $set: indicators,
        },
    };
    return update(state, settings);
};

const reducer: ReducerGroup<DomainData> = {
    [INDICATOR_ACTION.setIndicators]: setIndicators,
};

export default reducer;
