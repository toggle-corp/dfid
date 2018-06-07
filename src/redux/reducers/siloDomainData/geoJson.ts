import update from '../../../vendor/react-store/utils/immutable-update';

import {
    SiloDomainData,
    ReducerGroup,

    SetGeoJsonsAction,
} from '../../interface';
import { mapObjectToObject } from '../../../utils/map';

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
    const geoJsonSettings = mapObjectToObject<SetGeoJsonsAction, object>(
        geoJsons,
        geoJson => ({ $set: geoJson }),
    );

    const settings = {
        geoJsons: geoJsonSettings,
    };

    return update(state, settings);
};

const reducer: ReducerGroup<SiloDomainData> = {
    [GEO_JSON_ACTION.setGeoJsons]: setGeoJsons,
};

export default reducer;
