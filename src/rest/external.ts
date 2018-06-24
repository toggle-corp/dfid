import { p } from '../config/rest';

export const createUrlForGoogleViewer = (docUrl: string) =>
    `https://drive.google.com/viewerng/viewer?${p({
        url: docUrl,
        pid: 'explorer',
        efh: false,
        a: 'v',
        chrome: false,
        embedded: true,
    })}`;
