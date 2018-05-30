import React, { Fragment } from 'react';
import FixedTabs from '../../../vendor/react-store/components/View/FixedTabs';
import MultiViewContainer from '../../../vendor/react-store/components/View/MultiViewContainer';

import CountryDetailInfo from './CountryDetailInfo';
import MultiProgrammeDetailInfo from './MultiProgrammeDetailInfo';
import MultiProvinceDetailInfo from './MultiProvinceDetailInfo';
import MultiSectorDetailInfo from './MultiSectorDetailInfo';

import styles from './styles.scss';

interface Props {
    loadingProvinceData: boolean;
    loadingProgrammeData: boolean;
    loadingSectorData: boolean;
    loadingCountryData: boolean;
}

interface State {}

interface Routes {
    province: string;
    programme: string;
    sector: string;
    country: string;
}

interface Views {
    province: object;
    programme: object;
    sector: object;
    country: object;
}

export default class InformationPane extends React.PureComponent<Props, State>{
    routes: Routes;
    views: Views;

    constructor(props: Props) {
        super(props);

        this.routes = {
            country: 'Country',
            province: 'Province',
            programme: 'Programme',
            sector: 'Sector',
        };

        this.views = {
            province: {
                component: () => (
                    <MultiProvinceDetailInfo loading={this.props.loadingProvinceData} />
                ),
            },

            programme: {
                component: () => (
                    <MultiProgrammeDetailInfo loading={this.props.loadingProgrammeData} />
                ),
            },

            sector: {
                component: () => (
                    <MultiSectorDetailInfo loading={this.props.loadingSectorData} />
                ),
            },

            country: {
                component: () => (
                    <CountryDetailInfo loading={this.props.loadingCountryData} />
                ),
            },
        };
    }

    render() {
        return (
            <Fragment>
                <FixedTabs
                    className={styles.fixedTabs}
                    useHash
                    replaceHistory
                    tabs={this.routes}
                />
                <MultiViewContainer
                    useHash
                    views={this.views}
                />
            </Fragment>
        );
    }
}
