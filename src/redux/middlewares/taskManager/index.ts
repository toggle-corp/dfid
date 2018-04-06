import { SpecificMiddleware, MiddlewareAPI, Action, Dispatch } from 'redux';
import Manager from './Manager';
import TokenRefresher from './tasks/TokenRefresher';
import { RootState } from '../../../redux/interface';

export const enum TASK_MANAGER_ACTION {
    start = 'taskManager/START',
    stop = 'taskManager/STOP',
}
export const startTasksAction = () => ({
    type: TASK_MANAGER_ACTION.start,
});
export const stopTasksAction = () => ({
    type: TASK_MANAGER_ACTION.stop,
});

interface MyAction extends Action {
    callback?(): void;
}

const taskManager: SpecificMiddleware<RootState> = (store: MiddlewareAPI<RootState>) => {
    const manager = new Manager('background');

    const tokenRefresher = new TokenRefresher(store);
    manager.add(tokenRefresher);

    return (next: Dispatch<RootState>) => <A extends MyAction>(action: A): A => {
        switch (action.type) {
            case TASK_MANAGER_ACTION.start:
                manager.start()
                    .then(() => {
                        if (action.callback) {
                            action.callback();
                        }
                    });
                break;
            case TASK_MANAGER_ACTION.stop:
                manager.stop();
                break;
            default:
        }
        return next(action);
    };
};

export default taskManager;
