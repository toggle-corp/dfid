import update from '../../../vendor/react-store/utils/immutable-update';

import {
    DomainData,
    ReducerGroup,

    SetProgrammesAction,
    SetProgrammesDataAction,
} from '../../interface';

// ACTION-TYPE

export const enum PROGRAMME_ACTION {
    setProgrammes = 'domainData/PROGRAMME/SET_PROGRAMMES',
    setProgrammesData = 'domainData/PROGRAMME/SET_PROGRAMMES_DATA',
}

// ACTION-CREATOR

export const setProgrammesAction = (
    { programmes }: SetProgrammesAction,
) => ({
    programmes,
    type: PROGRAMME_ACTION.setProgrammes,
});

export const setProgrammesDataAction = (
    { programmesData }: SetProgrammesDataAction,
) => ({
    programmesData,
    type: PROGRAMME_ACTION.setProgrammesData,
});

// REDUCER

const setProgrammes = (state: DomainData, action: SetProgrammesAction) => {
    const { programmes } = action;
    const settings = {
        programmes: {
            $set: programmes,
        },
    };
    return update(state, settings);
};

const setProgrammesData = (state: DomainData, action: SetProgrammesDataAction) => {
    const { programmesData } = action;
    const settings = {
        programmesData: {
            $set: programmesData,
        },
    };
    return update(state, settings);
};


const reducer: ReducerGroup<DomainData> = {
    [PROGRAMME_ACTION.setProgrammes]: setProgrammes,
    [PROGRAMME_ACTION.setProgrammesData]: setProgrammesData,
};

export default reducer;
