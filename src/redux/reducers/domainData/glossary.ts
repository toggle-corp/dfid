import update from '../../../vendor/react-store/utils/immutable-update';

import {
    DomainData,
    ReducerGroup,

    SetGlossaryDataAction,
} from '../../interface';

// ACTION-TYPE

export const enum GLOSSARY_ACTION {
    setGlossaryData = 'domainData/GLOSSARY/SET_GLOSSARY_DATA',
}

// ACTION-CREATOR
export const setGlossaryDataAction = (
    { glossaryData }: SetGlossaryDataAction,
) => ({
    glossaryData,
    type: GLOSSARY_ACTION.setGlossaryData,
});

// REDUCER
const setGlossaryData = (state: DomainData, action: SetGlossaryDataAction) => {
    const { glossaryData } = action;
    const settings = {
        glossaryData: {
            $set: glossaryData.sort((a, b) => b.id - a.id),
        },
    };
    return update(state, settings);
};

const reducer: ReducerGroup<DomainData> = {
    [GLOSSARY_ACTION.setGlossaryData]: setGlossaryData,
};


export default reducer;
