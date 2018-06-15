import React from 'react';

import styles from './styles.scss';

export default class Glossary extends React.PureComponent {
    render() {
        return (
            <div className={styles.glossary}>
               <div className={styles.map}>
                    Glossary
                </div>
            </div>
        );
    }
}
