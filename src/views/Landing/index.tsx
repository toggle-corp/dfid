import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Redux from 'redux';
import { connect } from 'react-redux';

import { reverseRoute } from '../../vendor/react-store/utils/common';
import ListView from '../../vendor/react-store/components/View/List/ListView';
import Numeral from '../../vendor/react-store/components/View/Numeral';
import PieChart from '../../vendor/react-store/components/Visualization/PieChart';
import HorizontalBar from '../../vendor/react-store/components/Visualization/HorizontalBar';

import { pathNames } from '../../constants';
import logo from '../../resources/img/logo.png';
// import backgroundImage from '../../resources/img/background2.png';

import { RootState } from '../../redux/interface';
import { setDashboardProvinceAction } from '../../redux';

import Province from './Province';
import ProvinceMap from './ProvinceMap';

import styles from './styles.scss';

interface Props {
    setDashboardProvince(provinceId: number): void;
}

interface State {
    redirectTo?: string;
}

interface Data {
    provincesCovered: number;
    districtReached: number;
    municipalitiesCovered: number;
    totalProjects: number;
    totalSectors: number;
    totalBudget: string;
}

interface Item {
    label: string;
    value: number | string;
    icon?: string;
    isCurrency?: boolean;
}

const routeToDashboard = {
    pathname: reverseRoute(pathNames.dashboard),
};

const routeToExplore = {
    pathname: reverseRoute(pathNames.dashboard),
};

const routeToGlossary = {
    pathname: reverseRoute(pathNames.dashboard),
};

interface Dictionary<T> {
    [key:  string]: T;
}

interface ProvinceData {
    id: number;
    name: string;
    noOfActiveProjects: number;
    totalBudget: number;
}

const colorScheme = [
    '#ede8b1',
    '#c7e9b4',
    '#7fcdbb',
    '#41b6c4',
    '#1d91c0',
    '#225ea8',
    '#253494',
];


const labelAccessor = (d: ProvinceData) => {
    const num = Numeral.renderText({
        value: d.totalBudget,
        precision: 2,
        normal: true,
        lang: 'en',
        prefix: '£ ',
        separator: ',',
    });
    return `${num} / ${d.name}`;
};
const valueAccessor = (d: ProvinceData) => d.totalBudget;

const provinceDataLabelAccessor = (d: ProvinceData) => d.name;
const provinceDataValueAccessor = (d: ProvinceData) => d.noOfActiveProjects;

export class Landing extends React.PureComponent<Props, State> {
    provinces: number[];
    provincesData: Dictionary<ProvinceData>;
    data: Data;
    defaultData: object;

    static itemKeySelector = (item: Item) => item.label;
    static provinceKeyExtractor = (province: ProvinceData) => province.name;

    constructor(props: Props) {
        super(props);

        this.state = {
            redirectTo: undefined,
        };

        this.provinces = [1, 2, 3, 4, 5, 6, 7];
        this.defaultData = {};
        this.provincesData = {
            1:  {
                id: 1,
                name: 'Province 1',
                noOfActiveProjects: 5,
                totalBudget: 4020268,
            },
            2: {
                id: 2,
                name: 'Province 2',
                noOfActiveProjects: 3,
                totalBudget: 8744301,
            },
            3: {
                id: 3,
                name: 'Province 3',
                noOfActiveProjects: 3,
                totalBudget: 16600081 ,
            },
            4: {
                id: 4,
                name: 'Province 4',
                noOfActiveProjects: 2,
                totalBudget: 8529035 ,
            },
            5: {
                id: 5,
                name: 'Province 5',
                noOfActiveProjects: 3,
                totalBudget: 5129832 ,
            },
            6: {
                id: 6,
                name: 'Province 6',
                noOfActiveProjects: 2,
                totalBudget: 11253282 ,
            },
            7: {
                id: 7,
                name: 'Province 7',
                noOfActiveProjects: 1,
                totalBudget: 7818687 ,
            },
        };

        this.data = {
            provincesCovered: 7,
            districtReached: 77,
            municipalitiesCovered:756,
            totalProjects: 12,
            totalSectors: 11,
            totalBudget: '£ 4.98 M',
        };
    }

    handleMapClick = (province: number) => {
        const { setDashboardProvince } = this.props;
        setDashboardProvince(province);
        this.setState({ redirectTo: reverseRoute(pathNames.dashboard) });
    }

    handleMapHover = (province: number) => {
        console.warn(province);
    }

    renderOverviewItem = (k: undefined, data: Item) => (
        <div
            key={data.label}
            className={styles.item}
        >
            <div className={styles.value}>
                {data.value || '-'}
            </div>
            <div className={styles.label}>
                {data.label || '-'}
            </div>
        </div>
    )

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
            { label: 'budget', value: totalBudget },
            { label: 'total projects', value: totalProjects },
            { label: 'total sectors', value: totalSectors  },
            { label: 'provinces', value: provincesCovered },
            { label: 'districts', value: districtReached },
            { label: 'municipalities', value: municipalitiesCovered },
        ];

        return (
            <div className={styles.overview}>
                <h3 className={styles.heading}>
                    Overview
                </h3>
                <ListView
                    className={styles.content}
                    keyExtractor={Landing.itemKeySelector}
                    data={items}
                    modifier={this.renderOverviewItem}
                />
            </div>
        );
    }

    renderAbout = () => (
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

    renderProvince = (key: string, datum: ProvinceData) => {
        return (
            <Province
                key={key}
                datum={datum}
            />
        );
    }

    renderFooter = () => (
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
        const { redirectTo } = this.state;
        if (redirectTo) {
            return (
                <Redirect
                    push
                    to={redirectTo}
                />
            );
        }
        // tslint:disable-next-line variable-name
        const Overview = this.renderOverview;

        // tslint:disable-next-line variable-name
        const About = this.renderAbout;

        // tslint:disable-next-line variable-name
        const Footer = this.renderFooter;

        const provincesDataList = Object.values(this.provincesData);

        return (
            <div className={styles.landing}>
                <div className={styles.header}>
                    <div className={styles.content}>
                        <img
                            className={styles.logo}
                            src={logo}
                        />
                        <div className={styles.menu}>
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
                </div>
                <div className={styles.body}>
                    <div className={styles.mapSection}>
                        <ProvinceMap
                            onHover={this.handleMapHover}
                            onClick={this.handleMapClick}
                            className={styles.provinceMap}
                            colorScheme={colorScheme}
                        />
                        <Overview />
                    </div>
                    <div className={styles.charts}>
                        <div className={styles.chartContainer}>
                            <h3 className={styles.heading}>
                                Total Budget
                            </h3>
                            <PieChart
                                colorScheme={colorScheme}
                                className={styles.chart}
                                data={provincesDataList}
                                labelAccessor={labelAccessor}
                                valueAccessor={valueAccessor}
                            />
                        </div>
                        <div className={styles.chartContainer}>
                            <h3 className={styles.heading}>
                                Active DFID projects
                            </h3>
                            <HorizontalBar
                                colorScheme={colorScheme}
                                className={styles.chart}
                                data={provincesDataList}
                                labelAccessor={provinceDataLabelAccessor}
                                valueAccessor={provinceDataValueAccessor}
                            />
                        </div>
                    </div>
                    <About />
                </div>
                <Footer />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setDashboardProvince: (provinceId: number) => dispatch(setDashboardProvinceAction(provinceId)),
});

export default connect<Props>(
    undefined, mapDispatchToProps,
)(Landing);
