import Raven from 'raven-js';

const enableRaven = process.env.NODE_ENV === 'production';
const dns = 'https://5335a3c646724d2ea7beda7a701e48a5@sentry.io/1278553';
const config = {
    environment: process.env.NODE_ENV,
    release: process.env.REACT_APP_DFID_COMMIT_SHA,
    tags: {
        react_store_release: process.env.REACT_APP_REACT_STORE_COMMIT_SHA as string,
        ravl_release: process.env.REACT_APP_RAVL_COMMIT_SHA as string,
    },
};

// Sentry Config For BoundError
export const ravenInitialize = () => {
    if (enableRaven) {
        Raven.config(dns, config).install();
    }
};

export const handleException = (error: Error | ErrorEvent | string, errorInfo?: any) => {
    if (enableRaven && Raven.isSetup()) {
        // NOTE: Only in development error report will be applied twice
        Raven.captureException(error, { extra: errorInfo });
    }
};

export const handleReport = () => {
    // NOTE: Only works after Raven is initialized
    if (enableRaven && Raven.isSetup() && Raven.lastEventId()) {
        Raven.showReportDialog();
    }
};
