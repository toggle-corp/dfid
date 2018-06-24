import update from '../../../vendor/react-store/utils/immutable-update';

import {
    SiloDomainData,
    ReducerGroup,

    SetSelectedExploreAction,
} from '../../interface';

// ACTION-TYPE

export const enum SILO_EXPLORE_ACTION {
    setSelectedExplore = 'siloDomainData/EXPLORE_ACTION/SET_ACTIVE_EXPLORE',
}

// ACTION-CREATOR

export const setSelectedExploreAction = (
    { exploreId }: SetSelectedExploreAction,
) => ({
    exploreId,
    type: SILO_EXPLORE_ACTION.setSelectedExplore,
});

// REDUCER

const setSelectedExplore = (
    state: SiloDomainData, { exploreId }: SetSelectedExploreAction,
) => {
    const settings = {
        explore: {
            selectedExplore: {
                $set: exploreId,
            },
        },
    };
    return update(state, settings);
};

const reducer: ReducerGroup<SiloDomainData> = {
    [SILO_EXPLORE_ACTION.setSelectedExplore]: setSelectedExplore,
};

export default reducer;
