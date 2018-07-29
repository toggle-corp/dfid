import update from '../../../vendor/react-store/utils/immutable-update';

import {
    SiloDomainData,
    ReducerGroup,

    SetSelectedExploreAction,
    SetExploreDataAction,
} from '../../interface';
import { EXPLORE_ACTION } from '../domainData/explore';

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

export const setExploreDataSiloAction = (
    { exploreData }: SetExploreDataAction,
) => ({
    exploreData,
    type: EXPLORE_ACTION.setExploreData,
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

const setExploreData = (state: SiloDomainData, action: SetExploreDataAction) => {
    const { exploreData } = action;
    if (exploreData.length) {
        const {
            selectedExplore: exploreId = exploreData.sort((a, b) => a.id - b.id)[0].id,
        } = ((state || {}).explore || {});
        return setSelectedExplore(state, { exploreId });
    }
    return state;
};

const reducer: ReducerGroup<SiloDomainData> = {
    [SILO_EXPLORE_ACTION.setSelectedExplore]: setSelectedExplore,
    [EXPLORE_ACTION.setExploreData]: setExploreData,
};

export default reducer;
