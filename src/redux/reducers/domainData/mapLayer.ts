import update from '../../../vendor/react-store/utils/immutable-update';

import {
    DomainData,
    ReducerGroup,

    SetMapLayersAction,
} from '../../interface';

// ACTION-TYPE

export const enum MAP_LAYER_ACTION {
    setMapLayers = 'domainData/MAP_LAYER/SET_MAP_LAYERS',
}

// ACTION-CREATOR

export const setMapLayersAction = (
    { mapLayers }: SetMapLayersAction,
) => ({
    mapLayers,
    type: MAP_LAYER_ACTION.setMapLayers,
});

// REDUCER

const setMapLayers = (state: DomainData, action: SetMapLayersAction) => {
    const { mapLayers } = action;
    const settings = {
        mapLayers: {
            $set: mapLayers,
        },
    };
    return update(state, settings);
};

const reducer: ReducerGroup<DomainData> = {
    [MAP_LAYER_ACTION.setMapLayers]: setMapLayers,
};

export default reducer;
