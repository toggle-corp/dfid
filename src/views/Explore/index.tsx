import React from 'react';
import { connect } from 'react-redux';
import Redux from 'redux';

import { RestRequest } from '../../vendor/react-store/utils/rest';
import styles from './styles.scss';
import Table, {
    Header,
} from '../../vendor/react-store/components/View/Table';

import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';
import {
    RootState,
    ExploreData,
    SetExploreDataAction,
} from '../../redux/interface';
import {
    compareNumber,
} from '../../vendor/react-store/utils/common';

import {
    exploreDataSelector,
    setExploreDataAction,
} from '../../redux';


import ExploreDataGetRequest from './requests/ExploreDataGetRequest';
interface OwnProps {
    loading?: boolean;
}
interface PropsFromState {
    exploreData: ExploreData[];
}

interface PropsFromDispatch {
    setExploreData(params: SetExploreDataAction): void;
}
type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State {
    loadingExploreData: boolean;
}



export class Explore extends React.PureComponent<Props, State> {
    exploreDataRequest: RestRequest;
    headers: Header<ExploreData>[];


    constructor(props: Props) {
        super(props);

        this.state = {
            loadingExploreData: true,
        };
        this.headers = [
            {
                key: 'id',
                label: 'S.N',
                sortable: true,
                comparator: (a, b) => compareNumber(a.id, b.id),
                order: 1,
            },
            {
                key: 'title',
                label: 'Title',
                order: 2,
            },
            {
                key: 'pdf',
                label: 'Document Link',
                order: 3,
            },

        ];

    }
    componentWillMount() {
        this.startRequestForExploreData();
    }

    componentWillUnmount() {
        if (this.exploreDataRequest) {
            this.exploreDataRequest.stop();
        }
    }

    startRequestForExploreData = () => {
        if (this.exploreDataRequest) {
            this.exploreDataRequest.stop();
        }
        const exploreDataRequest = new ExploreDataGetRequest({
            setState: params => this.setState(params),
            setExploreData: this.props.setExploreData,
        });
        this.exploreDataRequest = exploreDataRequest.create();
        this.exploreDataRequest.start();
    }


    keyExtractor = (item: ExploreData) => item.id;

    render() {

        const { loadingExploreData } = this.state;
        const { exploreData } = this.props;
        return (
            <div className={styles.explore}>
               <div className={styles.content}>
                   <h3>Infographics</h3>
                <div className={styles.table}>
                    {loadingExploreData && <LoadingAnimation />}
                    <Table
                         data={exploreData}
                         headers={this.headers}
                         keyExtractor={this.keyExtractor}
                    />
                </div>
            </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    exploreData: exploreDataSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setExploreData: (params: SetExploreDataAction) => dispatch(setExploreDataAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Explore);
