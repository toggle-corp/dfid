import update from '../../../vendor/react-store/utils/immutable-update';

import {
    SiloDomainData,
    ReducerGroup,

    SetGeoJsonsAction,
} from '../../interface';

// ACTION-TYPE

export const enum GEO_JSON_ACTION {
    setGeoJsons = 'siloDomainData/MAP_LAYER/SET_GEO_JSONS',
}

// ACTION-CREATOR

export const setGeoJsonsAction = (
    geoJsons: SetGeoJsonsAction,
) => ({
    geoJsons,
    type: GEO_JSON_ACTION.setGeoJsons,
});

// REDUCER

const setGeoJsons = (state: SiloDomainData, { geoJsons }: { geoJsons: SetGeoJsonsAction }) => {
    const settingsGeoJsons = {};

    Object.keys(geoJsons).forEach((url) => {
        settingsGeoJsons[url] = { $set: geoJsons[url] };
    });

    const settings = {
        geoJsons: settingsGeoJsons,
    };

    return update(state, settings);
};

const reducer: ReducerGroup<SiloDomainData> = {
    [GEO_JSON_ACTION.setGeoJsons]: setGeoJsons,
};

export default reducer;
