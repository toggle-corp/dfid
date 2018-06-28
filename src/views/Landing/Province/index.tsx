import React from 'react';
import Redux from 'redux';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { reverseRoute } from '../../../vendor/react-store/utils/common';
import ListView from '../../../vendor/react-store/components/View/List/ListView';
import { pathNames } from '../../../constants';

import budgetIcon from '../../../resources/img/budget.png';
import projectIcon from '../../../resources/img/project.png';

import {
    RootState,
    ProvinceInfo,
    Municipality,
    SetDashboardProvinceAction,
} from '../../../redux/interface';
import {
    setDashboardProvinceAction,
    municipalitiesSelector,
} from '../../../redux';
import ProvinceDetailItem from '../ProvinceDetailItem';
import styles from './styles.scss';

interface OwnProps {
    datum: ProvinceInfo;
}
interface PropsFromState {
    municipalities: Municipality[];
}
interface PropsFromDispatch {
    setDashboardProvince(params: SetDashboardProvinceAction): void;
}
type Props = OwnProps & PropsFromDispatch & PropsFromState;

const routeToDashboard = {
    pathname: reverseRoute(pathNames.dashboard),
};

interface ProvinceDetail {
    label: string;
    value? : number;
    icon: string;
    isCurrency?: boolean;
}

class Province extends React.PureComponent<Props> {
    static keyExtractor = (province: ProvinceDetail) => province.label;

    setDashboardProvince = (provinceId: number) => () => {
        const { setDashboardProvince, municipalities } = this.props;
        setDashboardProvince({
            provinceId,
            municipalities,
        });
    }

    renderProvinceDetailItem = (key: string, datum: ProvinceDetail) => {
        return (
            <ProvinceDetailItem
                key={key}
                datum={datum}
            />
        );
    }

    render() {
        const { datum } = this.props;

        const {
            id,
            name = '-',
            activeProgrammes,
            totalBudget,
        } = datum;

        const provinceDetailItemList: ProvinceDetail[] = [
            {
                label: 'Active DFID projects',
                value: activeProgrammes,
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
                    keyExtractor={Province.keyExtractor}
                    data={provinceDetailItemList}
                    modifier={this.renderProvinceDetailItem}
                />
            </Link>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    municipalities: municipalitiesSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setDashboardProvince: (params: SetDashboardProvinceAction) =>
        dispatch(setDashboardProvinceAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Province);
