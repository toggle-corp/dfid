import React from 'react';
import {
    Link,
} from 'react-router-dom';

import { reverseRoute } from '../../vendor/react-store/utils/common';

import {
    pathNames,
} from '../../constants';

import styles from './styles.scss';

interface Props {}

export default class Landing extends React.PureComponent {
    provinces: number[];
    provincesData: {};
    defaultProvince: object;

    constructor(props: Props) {
        super(props);

        this.provinces = [1, 2, 3, 4, 5, 6, 7];
        this.defaultProvince = {};
        this.provincesData = {
            1:  {
                id: 1,
                name: 'Province 1',
                totalPopulation: 5404145,
                povertyRate: 24.3,
                noOfActiveProjects: 7,
                totalBudget: 3434345225,
            },
            2: {},
            3: {},
            4: {},
            5: {},
            6: {
                id: 6,
                name: 'Province 6',
                totalPopulation: 5404145,
                povertyRate: 24.3,
                noOfActiveProjects: 7,
                totalBudget: 3434345225,
            },
            7: {},
        };
    }

    getLinkForProvince = (id: number) => (
        reverseRoute(pathNames.province, { provinceId: id })
    )

    renderProvinces = (id: number) => {
        const {
            name,
            totalPopulation,
            noOfActiveProjects,
            totalBudget,
            povertyRate,
        } = this.provincesData[id] || this.defaultProvince;

        return (
           <Link
                key={id}
                to={this.getLinkForProvince(id)}
                className={styles.province}
           >
                <h2 className={styles.name}>
                   <p>{name}</p>
                </h2>
                <div className={styles.population}>
                    <span>Total Population: {totalPopulation}</span>
                </div>
                <div className={styles.poverty}>
                    <span>Poverty Rate: {povertyRate}</span>
                </div>

                <div className={styles.projects}>
                    <span>Active DFID Projects: {noOfActiveProjects}</span>
                </div>
                <div className={styles.budget}>
                    <span>Total Budget(FY 2017/18): {totalBudget}</span>
                </div>
           </Link>
        );
    }

    render() {
        return (
            <div className={styles.landing}>
                <div className={styles.pheader}>
                   <h2>DFID Nepal in Provinces</h2>
                </div>
                <div className={styles.provinces}>
                    {
                        this.provinces.map(provinceId => (
                            this.renderProvinces(provinceId)
                        ))
                    }
                </div>
                <div className={styles.bottom}>
                    <div className={styles.dfiddata}>
                        DFID
                    </div>
                    <div className={styles.about}>
                        About
                    </div>
                    <div className={styles.dataset}>
                        Dataset
                    </div>

                </div>
            </div>
        );
    }
}
