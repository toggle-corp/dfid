import React from 'react';
import {
    detect,
    BrowserInfo,
} from 'detect-browser';

import WarningButton from '../../vendor/react-store/components/Action/Button/WarningButton';

import * as styles from './styles.scss';

const defaultProps = {
    className: '',
};

interface Props {
    className?: string;
}

interface State {
    ignoreWarning: boolean;
    browserIsSupported?: boolean;
    browser?: BrowserInfo | null;
}

export default class BrowserDetect extends React.PureComponent<Props, State> {
    static defaultProps = defaultProps;

    static getBrowserSupportStatus() {
        const browser = detect();
        let browserIsSupported = undefined;

        if (browser) {
            console.warn('Browser Detected: ', browser.name);
            switch (browser.name) {
                case 'chrome':
                    browserIsSupported = true;
                    break;
                case 'firefox':
                case 'edge':
                default:
                    browserIsSupported = false;
            }
        } else {
            console.warn('Browser Detection Failed');
        }

        return {
            browserIsSupported,
            browser,
        };
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            ...BrowserDetect.getBrowserSupportStatus(),
            ignoreWarning: false,
        };
    }

    setIgnoreWarning = () => {
        this.setState({ ignoreWarning: true });
    }

    render() {
        const {
            browser,
            browserIsSupported,
            ignoreWarning,
        } = this.state;

        if (browserIsSupported || ignoreWarning) {
            return null;
        }

        const name = browser ? browser.name : 'N/A';

        return (
            <div className={styles.popup}>
                <p>
                    Hello <span>{name}</span> user!
                </p>
                <p>
                    For the best experience,
                    we recommend viewing the dashboard on <span>Google Chrome</span>,
                    which you can download here:
                </p>
                <p>
                    <a href="https://www.google.com/chrome/">
                        https://www.google.com/chrome/
                    </a>
                </p>
                <p>
                    If you don't already have it.
                    You may continue to use <span>{name}</span>,
                    however some parts of the dashboard may not work properly.
                </p>
                <WarningButton
                    onClick={this.setIgnoreWarning}
                >
                    Ignore
                </WarningButton>
            </div>
        );
    }
}
