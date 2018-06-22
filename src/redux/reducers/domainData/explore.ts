import update from '../../../vendor/react-store/utils/immutable-update';

import {
    DomainData,
    ReducerGroup,

    SetExploreDataAction,
} from '../../interface';

// ACTION-TYPE

export const enum EXPLORE_ACTION {
    setExploreData = 'domainData/EXPLORE/SET_EXPLORE_DATA',
}

// ACTION-CREATOR
export const setExploreDataAction = (
    { exploreData }: SetExploreDataAction,
) => ({
    exploreData,
    type: EXPLORE_ACTION.setExploreData,
});

// REDUCER
const setExploreData = (state: DomainData, action: SetExploreDataAction) => {
    const { exploreData } = action;
    const settings = {
        exploreData: {
            $set: exploreData.sort((a, b) => b.id - a.id),
        },
    };
    return update(state, settings);
};

const reducer: ReducerGroup<DomainData> = {
    [EXPLORE_ACTION.setExploreData]: setExploreData,
};


export default reducer;
