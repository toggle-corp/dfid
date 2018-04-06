import { NOTIFICATION } from './vendor/react-store/components/View/Toast';

import { Notification } from './redux/interface';
import { notifySendAction } from './redux';
import store from './store';

class Notifier {
    type: {
        INFO: string;
        ERROR: string;
        WARNING: string;
        SUCCESS: string;
    };
    duration: {
        SLOW: number;
        MEDIUM: number;
        FAST: number;
    };
    defaultNotification: Notification;

    constructor() {
        this.type = NOTIFICATION;

        this.duration = {
            SLOW: 4000,
            MEDIUM: 2000,
            FAST: 1000,
        };

        this.defaultNotification = {
            type: this.type.INFO,
            title: 'Notification',
            message: 'This is a notification',
            dismissable: true,
            duration: 2000,
        };
    }

    send = (notification: Partial<Notification>) => {
        const toastNotification = {
            ...this.defaultNotification,
            ...notification,
        };

        const action = notifySendAction(toastNotification);
        store.dispatch(action);
    }
}

const notify = new Notifier();
export default notify;
