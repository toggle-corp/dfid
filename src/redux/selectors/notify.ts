import { RootState, Notification } from '../interface';

// NOTE: Use these to make sure reference don't change
const emptyObject = {};

// tslint:disable-next-line import/prefer-default-export
export const lastNotifySelector = ({ notify }: RootState): Notification => (
    notify.notifications[0] || emptyObject
);
