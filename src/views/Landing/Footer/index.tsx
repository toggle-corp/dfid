import React from 'react';
import { Link } from 'react-router-dom';

import { reverseRoute } from '../../../vendor/react-store/utils/common';
import { pathNames } from '../../../constants';

export const routeToDashboard = {
    pathname: reverseRoute(pathNames.dashboard),
};

export const routeToExplore = {
    pathname: reverseRoute(pathNames.dashboard),
};

export const routeToGlossary = {
    pathname: reverseRoute(pathNames.glossary),
};

import * as styles from '../styles.scss';

export default class Footer extends React.PureComponent<{}> {

    renderMessage = () => (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.address}>
                    <div className={styles.title}>
                        DFID Nepal
                    </div>
                    <div className={styles.info}>
                        British Embassy 
                    </div>
                    <div className={styles.info}>
                        PO Box 106
                    </div>
                    <div className={styles.info}>
                        Kathmandu, Nepal
                    </div>
                </div>
                <div className={styles.contact}>
                    <div
                        className={styles.info}
                        title="Email"
                    >
                        <div className={styles.label}>
                            <span className="fa fa-envelope" />
                        </div>
                        <a
                            className={styles.value}
                            href="mailto:nepal-enquiries@dfid.gov.uk"
                        >
                            nepal-enquiries@dfid.gov.uk
                        </a>
                    </div>
                    <div
                        className={styles.info}
                        title="Telephone"
                    >
                        <div className={styles.label}>
                            <span className="fa fa-phone" />
                        </div>
                        <div className={styles.value}>
                            +977 1 5542980
                        </div>
                    </div>
                    <div
                        className={styles.info}
                        title="Fax"
                    >
                        <div className={styles.label}>
                            <span className="fa fa-fax" />
                        </div>
                        <div className={styles.value}>
                            +977 1 5000179
                        </div>
                    </div>
                </div>
                <div className={styles.links}>
                    <Link
                        className={styles.link}
                        to={routeToDashboard}
                    >
                        Dashboard
                    </Link>
                    <Link
                        className={styles.link}
                        to={routeToExplore}
                    >
                        Explore
                    </Link>
                    <Link
                        className={styles.link}
                        to={routeToGlossary}
                    >
                        Glossary
                    </Link>
                </div>
            </div>
        </footer>
)

    render() {
        return this.renderMessage();
    }
}
