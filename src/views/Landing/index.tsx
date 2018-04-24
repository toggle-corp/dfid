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

    constructor(props: Props) {
        super(props);

        this.provinces = [1, 2, 3, 4, 5, 6, 7];
        this.provincesData = {
            1: 'Population',
            2: 'Population',
            3: 'Population',
        };
    }

    getLinkForProvince = (provinceId: number) => (
        reverseRoute(pathNames.province, { provinceId })
    )

    renderProvinces = (provinceId: number) => (
       <Link
            key={provinceId}
            to={this.getLinkForProvince(provinceId)}
            className={styles.province}
       >
            <div>
                Province {provinceId}
            </div>
            <div>
                {this.provincesData[provinceId]}
            </div>
       </Link>
    )

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
            </div>
        );
    }
}
