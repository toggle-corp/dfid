import { ReducerGroup } from '../redux/interface';

const createReducerWithMap =
    <T>(reducers: ReducerGroup<T>, initialState: T) =>
    (state = initialState, action: { type: string }): T => {
        const { type } = action;
        const reducer = reducers[type];
        if (!reducer) {
            return state;
        }
        return reducer(state, action);
    };
export default createReducerWithMap;
