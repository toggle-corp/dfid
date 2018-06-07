import update from '../../../vendor/react-store/utils/immutable-update';

import {
    DomainData,
    ReducerGroup,

    SetIndicatorsAction,
    SetIndicatorsDataAction,
} from '../../interface';

// ACTION-TYPE

export const enum INDICATOR_ACTION {
    setIndicators = 'domainData/INDICATOR/SET_INDICATORS',
    setIndicatorsData = 'domainData/INDICATOR/SET_INDICATORS_DATA',
}

// ACTION-CREATOR

export const setIndicatorsAction = (
    { indicators }: SetIndicatorsAction,
) => ({
    indicators,
    type: INDICATOR_ACTION.setIndicators,
});

export const setIndicatorsDataAction = (
    { indicatorsData }: SetIndicatorsDataAction,
) => ({
    indicatorsData,
    type: INDICATOR_ACTION.setIndicatorsData,
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

const setIndicatorsData = (state: DomainData, action: SetIndicatorsDataAction) => {
    const { indicatorsData } = action;
    const settings = {
        indicatorsData: {
            $set: indicatorsData,
        },
    };
    return update(state, settings);
};

const reducer: ReducerGroup<DomainData> = {
    [INDICATOR_ACTION.setIndicators]: setIndicators,
    [INDICATOR_ACTION.setIndicatorsData]: setIndicatorsData,
};

export default reducer;
