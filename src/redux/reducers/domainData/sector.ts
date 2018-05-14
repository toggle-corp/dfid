import update from '../../../vendor/react-store/utils/immutable-update';

import {
    DomainData,
    ReducerGroup,

    SetSectorsAction,
} from '../../interface';

// ACTION-TYPE

export const enum SECTOR_ACTION {
    setSectors = 'domainData/SECTOR/SET_SECTORS',
}

// ACTION-CREATOR

export const setSectorsAction = (
    { sectors }: SetSectorsAction,
) => ({
    sectors,
    type: SECTOR_ACTION.setSectors,
});

// REDUCER

const setSectors = (state: DomainData, action: SetSectorsAction) => {
    const { sectors } = action;
    const settings = {
        sectors: {
            $set: sectors,
        },
    };
    return update(state, settings);
};


const reducer: ReducerGroup<DomainData> = {
    [SECTOR_ACTION.setSectors]: setSectors,
};

export default reducer;
