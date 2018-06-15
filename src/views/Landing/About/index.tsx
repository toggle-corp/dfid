import React from 'react';

import * as styles from '../styles.scss';

export default class About extends React.PureComponent<{}> {

    renderMessage = () => (
        <div className={styles.about}>
            <h2 className={styles.heading}>
                About
            </h2>
            <div className={styles.content}>
                <div className={styles.text} >
                    <p>
                        Nepal has the potential for higher,
                        inclusive economic growth through the
                        development of hydro-electric power and
                        tourism, both of which present significant opportunities
                        for UK business, and trade with India and China.
                    </p>
                    <p>
                        This potential is hampered by complex investment rules and processes,
                        costly and unreliable energy supply, poor transport infrastructure,
                        political instability, weak institutions and poor governance.
                        Nepal is highly vulnerable to natural disasters and climate
                        change which can push populations back into poverty,
                        destroy infrastructure and undermine growth.
                        The 2015 earthquakes caused extensive damage and Nepal
                        remains at high risk of a catastrophic earthquake.
                    </p>
                    <p>
                        Nepal is the 16 poorest country in the world and the second poorest
                        in Asia (after Afghanistan) in terms of per capita income.
                        23% of the population of 28 million people live on less than $1.25 a day.
                        The poorest people live in the inaccessible west
                        of the country or are from the dalit (untouchable) caste.
                        High unemployment means that about 1,500 Nepalis migrate for work every day.
                        Nepal’s poverty and inequality is reflected
                        in its ranking for human development; it is ranked
                        145 in the world in the Human Development Index,
                        a situation which has not improved significantly
                        since emerging from conflict in 2006.
                    </p>
                </div>
                <div className={styles.rightBox} />
            </div>
        </div>
)

    render() {
        return this.renderMessage();
    }
}
