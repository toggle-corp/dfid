import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { reverseRoute } from '../../vendor/react-store/utils/common';
import ListView from '../../vendor/react-store/components/View/List/ListView';
import { RestRequest } from '../../vendor/react-store/utils/rest';

import { pathNames } from '../../constants';
import logo from '../../resources/img/logo.png';
import backgroundImage from '../../resources/img/background2.png';

import { RootState } from '../../redux/interface';
import { setDashboardProvinceAction } from '../../redux';

import ProvinceDataGetRequest from './requests/ProvinceDataGetRequest';
import Province from './Province';

import styles from './styles.scss';

interface Props {
    setDashboardProvince(provinceId: number): void;
}
interface State {}

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

interface Dictionary<T> {
    [key:  string]: T;
}

interface ProvinceData {
    id: number;
    name: string;
    noOfActiveProjects: number;
    totalBudget?: number;
}

export class Landing extends React.PureComponent<Props, State> {
    provinces: number[];
    provincesData: Dictionary<ProvinceData>;
    data: Data;
    defaultData: object;
    provinceDataRequest: RestRequest;

    static itemKeySelector = (item: Item) => item.label;
    static provinceKeyExtractor = (province: ProvinceData) => province.name;

    constructor(props: Props) {
        super(props);

        this.provinces = [1, 2, 3, 4, 5, 6, 7];
        this.defaultData = {};
        this.provincesData = {
            1:  {
                id: 1,
                name: 'Province 1',
                noOfActiveProjects: 5,
                totalBudget: undefined,
            },
            2: {
                id: 2,
                name: 'Province 2',
                noOfActiveProjects: 3,
                totalBudget: undefined,
            },
            3: {
                id: 3,
                name: 'Province 3',
                noOfActiveProjects: 3,
                totalBudget: undefined,
            },
            4: {
                id: 4,
                name: 'Province 4',
                noOfActiveProjects: 2,
                totalBudget: undefined,
            },
            5: {
                id: 5,
                name: 'Province 5',
                noOfActiveProjects: 3,
                totalBudget: undefined,
            },
            6: {
                id: 6,
                name: 'Province 6',
                noOfActiveProjects: 2,
                totalBudget: undefined,
            },
            7: {
                id: 7,
                name: 'Province 7',
                noOfActiveProjects: 1,
                totalBudget: undefined,
            },
        };

        this.data = {
            provincesCovered: 7,
            districtReached: 77,
            municipalitiesCovered:756,
            totalProjects: 12,
            totalSectors: 11,
            totalBudget: '4.98 M',
        };
    }

    componentDidMount() {
        this.startRequestForProvinceData();
    }

    componentWillUnmount() {
        if (this.provinceDataRequest) {
            this.provinceDataRequest.stop();
        }
    }

    startRequestForProvinceData = () => {
        if (this.provinceDataRequest) {
            this.provinceDataRequest.stop();
        }
        const provinceDataRequest = new ProvinceDataGetRequest({
            setState: params => this.setState(params),
        });
        this.provinceDataRequest = provinceDataRequest.create();
        this.provinceDataRequest.start();
    }

    setDashboardProvince = (id: number) => () => {
        this.props.setDashboardProvince(id);
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
            { label: 'Provinces', value: provincesCovered },
            { label: 'Districts', value: districtReached },
            { label: 'Municipalities', value: municipalitiesCovered },
            { label: 'Total projects', value: totalProjects },
            { label: 'Total sectors', value: totalSectors  },
            { label: 'Total budget (£)', value: totalBudget },
        ];

        return (
            <div className={styles.overview}>
                <h2 className={styles.heading}>
                    Overview
                </h2>
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

    render() {
        // tslint:disable-next-line variable-name
        const Overview = this.renderOverview;

        // tslint:disable-next-line variable-name
        const About = this.renderAbout;

        const provincesDataList = Object.values(this.provincesData);

        return (
            <div className={styles.landing}>
                <div className={styles.header}>
                    <img
                        className={styles.logo}
                        src={logo}
                    />
                    <div className={styles.backdrop} />
                    <img
                        src={backgroundImage}
                        className={styles.background}
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
                    </div>
                </div>
                <div className={styles.body}>
                    <div className={styles.left}>
                        <Overview />
                        <About />
                    </div>
                    <div className={styles.right}>
                        <div className={styles.provinceList}>
                            <h4 className={styles.heading}>
                                Provinces
                            </h4>
                            <ListView
                                className={styles.content}
                                data={provincesDataList}
                                modifier={this.renderProvince}
                                keyExtractor={Landing.provinceKeyExtractor}
                            />
                        </div>
                    </div>
                </div>

                <footer className={styles.footer}>
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
                    </div>
                </footer>
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
