import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Root from './Root';
import registerServiceWorker from './utils/registerServiceWorker';

Object.defineProperty(Object.prototype, 'values', {
    // tslint:disable-next-line
    value: function() {
        if (this === null || this === undefined) {
            throw new TypeError('"this" is null or not defined');
        }

        return Object.keys(this).map(k => this[k]);
    },
    configurable: true,
    writable: true,
});

ReactDOM.render(
    <Root />,
    document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
