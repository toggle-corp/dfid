import Locker from '../../../vendor/react-store/utils/Locker';

export interface AbstractTask {
    start(): Promise<any>; // tslint:disable-line no-any
    stop(): Promise<any>; // tslint:disable-line no-any
}

export default class Manager {
    tasks: AbstractTask[];
    lockId: string;
    locker?: Locker;

    constructor(uniqueId: string) {
        // Unique lock id
        this.lockId = `task-${uniqueId}`;

        // List of tasks that need to be run only by one instance
        this.tasks = [];
    }

    add = (task: AbstractTask) => {
        this.tasks.push(task);
        return this;
    }

    start = () => this.stop()
        .then(() => {
            this.locker = new Locker(this.lockId);

            return this.locker
                .acquire()
                .then(() => Promise.all(this.tasks.map(t => t.start())));
        })

    stop = () => Promise.all(this.tasks.map(t => t.stop()))
        .then(() => {
            if (this.locker) {
                this.locker.release();
                this.locker = undefined;
            }
        })
}
