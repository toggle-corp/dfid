import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import ListView from '../../vendor/react-store/components/View/List/ListView';
import { RestRequest } from '../../vendor/react-store/utils/rest';

import logo from '../../resources/img/logo.png';
// import province1Image from '../../resources/img/province1.png';
// import province2Image from '../../resources/img/province2.png';
// import province3Image from '../../resources/img/province3.png';
// import province4Image from '../../resources/img/province4.png';
// import province5Image from '../../resources/img/province5.png';
// import province6Image from '../../resources/img/province6.png';
// import province7Image from '../../resources/img/province7.png';
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

export class Landing extends React.PureComponent<Props, State> {
    provinces: number[];
    provincesData: object;
    data: Data;
    defaultData: object;
    provinceDataRequest: RestRequest;

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
            {
                label: 'Total budget (£)',
                value: totalBudget,
            },
        ];

        return (
            <div className={styles.overview}>
                <h2 className={styles.heading}>
                    Overview
                </h2>
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

    render() {
        // tslint:disable-next-line variable-name
        const Overview = this.renderOverview;

        // tslint:disable-next-line variable-name
        const About = this.renderAbout;

        const provincesDataList = Object.values(this.provincesData);

        return (
            <div className={styles.landing}>
                <div className={styles.body}>
                    <div className={styles.left}>
                        <img
                            className={styles.logo}
                            src={logo}
                        />
                        <Overview />
                        <About />
                    </div>
                    <div className={styles.right}>
                        <div className={styles.links}>
                            <h4 className={styles.heading}>
                                Links
                            </h4>
                            <div className={styles.content}>
                                Links maybe
                            </div>
                        </div>
                        <div className={styles.provinceList}>
                            <h4 className={styles.heading}>
                                Provinces
                            </h4>
                            <ListView
                                className={styles.content}
                                data={provincesDataList}
                                renderer={Province}
                            />
                        </div>
                    </div>
                </div>

                <footer className={styles.footer}>
                    <div className={styles.title}>
                        DFID Nepal
                    </div>
                    <div className={styles.link}>
                        Dashboard
                    </div>
                    <div className={styles.link}>
                        Explore
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
