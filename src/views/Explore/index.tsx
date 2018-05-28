import React from 'react';

import styles from './styles.scss';

export default class Explore extends React.PureComponent {
    render() {
        return (
            <div className={styles.explore}>
               <div className={styles.map} />
               <div className={styles.stats}>
                    Stats
              </div>
            </div>
        );
    }
}
