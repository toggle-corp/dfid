import createReducerWithMap from '../../utils/createReducerWithMap';
import initialNotifyState from '../initial-state/notify';
import { Notify, Notification, ReducerGroup } from '../interface';

// TYPE

export const enum NOTIFY_ACTION {
    send = 'notify/SEND',
    hide = 'notify/HIDE',
}

// ACTION-CREATOR

export const notifySendAction = (notification: Notification) => ({
    notification,
    type: NOTIFY_ACTION.send,
});

export const notifyHideAction = () => ({
    type: NOTIFY_ACTION.hide,
});

// REDUCER

const notifySend = (state: Notify, action: { type: string, notification: Notification}): Notify => {
    const newState = {
        ...state,
        notifications: [action.notification],
    };
    return newState;
};

const notifyHide = (state: Notify) => {
    const newState = {
        ...state,
        notifications: [],
    };
    return newState;
};

export const notifyReducers: ReducerGroup<Notify> = {
    [NOTIFY_ACTION.send]: notifySend,
    [NOTIFY_ACTION.hide]: notifyHide,
};

const notifyReducer = createReducerWithMap(notifyReducers, initialNotifyState);
export default notifyReducer;
