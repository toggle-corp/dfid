import React from 'react';
import {
    Link,
} from 'react-router-dom';

import { reverseRoute } from '../../vendor/react-store/utils/common';
import ListView from '../../vendor/react-store/components/View/List/ListView';

import {
    pathNames,
} from '../../constants';

import styles from './styles.scss';
import province1Image from '../../resources/img/province1.png';
import province2Image from '../../resources/img/province2.png';
import province3Image from '../../resources/img/province3.png';
import province4Image from '../../resources/img/province4.png';
import province5Image from '../../resources/img/province5.png';
import province6Image from '../../resources/img/province6.png';
import province7Image from '../../resources/img/province7.png';
import logo from '../../resources/img/logo.png';
import budgetIcon from '../../resources/img/budget.png';
import projectIcon from '../../resources/img/project.png';

interface Props {}

interface Data {
    provincesCovered: number;
    districtReached: number;
    municipalitiesCovered: number;
    totalProjects: number;
    totalSectors: number;
    totalBudget: number;
}

interface Item {
    label: string;
    value: number;
    icon?: string;
}

export default class Landing extends React.PureComponent {
    provinces: number[];
    provincesData: object;
    data: Data;
    defaultData: object;

    constructor(props: Props) {
        super(props);

        this.provinces = [1, 2, 3, 4, 5, 6, 7];
        this.defaultData = {};
        this.provincesData = {
            1:  {
                id: 1,
                name: 'Province 1',
                totalPopulation: 5404145,
                povertyRate: 24.3,
                noOfActiveProjects: 7,
                totalBudget: 3434345225,
                image: province1Image,
            },
            2: {
                id: 2,
                name: 'Province 2',
                image: province2Image,
            },
            3: {
                id: 3,
                name: 'Province 3',
                image: province3Image,
            },
            4: {
                id: 4,
                name: 'Province 4',
                image: province4Image,
            },
            5: {
                id: 5,
                name: 'Province 5',
                image: province5Image,
            },
            6: {
                id: 6,
                name: 'Province 6',
                totalPopulation: 5404145,
                povertyRate: 24.3,
                noOfActiveProjects: 7,
                totalBudget: 3434345,
                image: province6Image,
            },
            7: {
                id: 7,
                name: 'Province 7',
                image: province7Image,
            },
        };

        this.data = {
            provincesCovered: 7,
            districtReached: 77,
            municipalitiesCovered:756,
            totalProjects: 12,
            totalSectors: 11,
            totalBudget: 2352352,
        };
    }

    getLinkForProvince = (id: number) => (
        reverseRoute(pathNames.province, { provinceId: id })
    )

    renderProvinceDetailItem = (k: undefined, data: Item) => {
        console.log(k);

        return (
            <div className={styles.item}>
                <img
                    className={styles.icon}
                    src={data.icon}
                />
                <div className={styles.label}>
                    {data.label || '-'}
                </div>
                <div className={styles.value}>
                    {data.value || '-'}
                </div>
            </div>
        );
    }

    renderProvince = (k: undefined, id: number) => {
        console.log(k);

        const {
            name,
            noOfActiveProjects,
            totalBudget,
            image,
        } = this.provincesData[id] || this.defaultData;

        const provinceDetailItemList = [
            { label: 'Active DFID projects', value: noOfActiveProjects, icon: projectIcon },
            { label: 'Total budget (FY 2017/18)', value: totalBudget, icon: budgetIcon },
        ];

        console.log(image);

        return (
            <Link
                key={id}
                to={this.getLinkForProvince(id)}
                className={styles.province}
            >
                <img
                    className={styles.image}
                    src={image}
                />
                <div className={styles.content}>
                    <div className={styles.title}>
                        {name || '-'}
                    </div>
                    <ListView
                        className={styles.content}
                        data={provinceDetailItemList}
                        modifier={this.renderProvinceDetailItem}
                    />
                </div>
            </Link>
        );
    }

    renderOverviewItem = (k: undefined, data: Item) => {
        console.log(k);

        return (
            <div className={styles.item}>
                <div className={styles.value}>
                    {data.value || '-'}
                </div>
                <div className={styles.label}>
                    {data.label || '-'}
                </div>
            </div>
        );
    }

    renderOverview = () => {
        const {
            provincesCovered,
            districtReached,
            municipalitiesCovered,
            totalProjects,
            totalSectors,
            totalBudget,
        } = this.data;

        const items: Item[] = [
            { label: 'Provinces covered', value: provincesCovered },
            { label: 'District reached', value: districtReached },
            { label: 'Municipalities covered', value: municipalitiesCovered },
            { label: 'Total projects', value: totalProjects },
            { label: 'Total sectors', value: totalSectors  },
            { label: 'Total budget', value: totalBudget },
        ];

        return (
            <div className={styles.overview}>
                <img
                    className={styles.logo}
                    src={logo}
                />
                <ListView
                    className={styles.content}
                    data={items}
                    modifier={this.renderOverviewItem}
                />
            </div>
        );
    }

    renderAbout = () => (
        <div className={styles.about}>
            <h2 className={styles.title}>
                About
            </h2>
            <div className={styles.content}>
                <p>
                    Nepal has the potential for higher,
                    inclusive economic growth through the
                    development of hydro-electric power and
                    tourism, both of which present significant opportunities
                    for UK business, and trade with India and China.
                </p>
                <p>
                    This potential is hampered by complex investment
                    rules and processes, costly and unreliable energy supply,
                    poor transport infrastructure, political instability,
                    weak institutions and poor governance.
                </p>
                <p>
                    Nepal is highly vulnerable to natural disasters
                    and climate change which can push populations
                    back into poverty, destroy infrastructure and undermine growth.
                </p>
            </div>
        </div>
    )

    renderExplore = () => (
        <div className={styles.explore}>
            <h2 className={styles.title}>
                Explore
            </h2>
            <div className={styles.content}>
                -
            </div>
        </div>
    )

    render() {
        // tslint:disable-next-line variable-name
        const Overview = this.renderOverview;

        // tslint:disable-next-line variable-name
        const About = this.renderAbout;

        // tslint:disable-next-line variable-name
        const Explore = this.renderExplore;

        return (
            <div className={styles.landing}>
                <div className={styles.left}>
                    <Overview />
                    <div className={styles.bottomContent}>
                        <About />
                        <Explore />
                    </div>
                </div>
                <div className={styles.right}>
                    <h2 className={styles.title}>
                        Provinces
                    </h2>
                    <ListView
                        className={styles.content}
                        data={this.provinces}
                        modifier={this.renderProvince}
                    />
                </div>
                <footer className={styles.footer}>
                    <div className={styles.title}>
                        DFID
                    </div>
                    <div className={styles.link}>Dashboard</div>
                    <div className={styles.link}>Explore</div>
                </footer>
            </div>
        );
    }
}
