import React from 'react';

import PrimaryButton from '../../vendor/react-store/components/Action/Button/PrimaryButton.js';

import { handleException, handleReport } from '../../config/sentry';
import styles from './styles.scss';

export default class ComponentError extends React.PureComponent {
    static handleException = handleException;

    render() {
        const errorText = 'Something went wrong with loading this page.';
        const reportErrorTitle = 'Report this error';

        return (
            <div className={styles.messageContainer}>
                {errorText}
                <PrimaryButton
                    // Use cloak for development
                    onClick={handleReport}
                    className={styles.button}
                >
                    {reportErrorTitle}
                </PrimaryButton>
            </div>
        );
    }
}
