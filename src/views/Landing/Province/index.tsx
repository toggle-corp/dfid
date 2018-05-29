import React from 'react';
import Redux from 'redux';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { reverseRoute } from '../../../vendor/react-store/utils/common';
import ListView from '../../../vendor/react-store/components/View/List/ListView';
import { pathNames } from '../../../constants';

import budgetIcon from '../../../resources/img/budget.png';
import projectIcon from '../../../resources/img/project.png';

import { RootState } from '../../../redux/interface';
import { setDashboardProvinceAction } from '../../../redux';
import ProvinceDetailItem from '../ProvinceDetailItem';
import styles from './styles.scss';

interface Data {
    id: number;
    name: string;
    noOfActiveProjects: number;
    totalBudget: number;
}

interface Props {
    setDashboardProvince(provinceId: number): void;
    datum: Data;
}

const routeToDashboard = {
    pathname: reverseRoute(pathNames.dashboard),
};

class Province extends React.PureComponent<Props> {
    setDashboardProvince = (id: number) => () => {
        const { setDashboardProvince } = this.props;
        setDashboardProvince(id);
    }

    render() {
        const { datum } = this.props;

        const {
            id,
            name = '-',
            noOfActiveProjects,
            totalBudget,
        } = datum;

        const provinceDetailItemList = [
            {
                label: 'Active DFID projects',
                value: noOfActiveProjects,
                icon: projectIcon,
            },
            {
                label: 'Total budget (FY 2017/18)',
                value: totalBudget,
                icon: budgetIcon,
                isCurrency: true,
            },
        ];


        return (
            <Link
                key={id}
                to={routeToDashboard}
                onClick={this.setDashboardProvince(id)}
                className={styles.province}
            >
                <div className={styles.title}>
                    {name}
                </div>
                <ListView
                    className={styles.content}
                    data={provinceDetailItemList}
                    renderer={ProvinceDetailItem}
                />
            </Link>
        );
    }
}

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setDashboardProvince: (provinceId: number) => dispatch(setDashboardProvinceAction(provinceId)),
});

export default connect<Props>(
    undefined,
    mapDispatchToProps,
)(Province);
