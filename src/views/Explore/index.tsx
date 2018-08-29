import React from 'react';
import { connect } from 'react-redux';
import Redux from 'redux';

import { RestRequest } from '../../vendor/react-store/utils/rest';
import ListView from '../../vendor/react-store/components/View/List/ListView';
import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';

import {
    RootState,
    ExploreData,
    SetExploreDataAction,
    SetSelectedExploreAction,
} from '../../redux/interface';

import {
    exploreDataSelector,
    selectedExploreDataSelector,
    setExploreDataAction,
    setSelectedExploreAction,
} from '../../redux';

import { iconNames } from '../../constants';

import ExploreDataGetRequest from './requests/ExploreDataGetRequest';
import Viewer from './Viewer';

import styles from './styles.scss';

interface OwnProps {
    loading?: boolean;
}
interface PropsFromState {
    exploreData: ExploreData[];
    selectedExploreData?: ExploreData;
}

interface PropsFromDispatch {
    setExploreData(params: SetExploreDataAction): void;
    setSelectedExplore(params: SetSelectedExploreAction): void;
}
type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State {
    loadingExploreData: boolean;
}

export class Explore extends React.PureComponent<Props, State> {
    exploreDataRequest: RestRequest;

    constructor(props: Props) {
        super(props);

        this.state = {
            loadingExploreData: true,
        };
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

    handleTableClick = (rowKey: number) => {
        this.props.setSelectedExplore({
            exploreId: rowKey,
        });
    }

    keyExtractor = (item: ExploreData) => String(item.id);

    renderListItem = (key: string, datum: ExploreData) => {
        const onClick = () => this.handleTableClick(datum.id);

        const { selectedExploreData } = this.props;

        const isSelected = selectedExploreData
            ? selectedExploreData.id === datum.id
            : false;

        const classNames = [
            styles.item,
        ];
        if (isSelected) {
            classNames.push(styles.selected);
        }

        return (
            <div
                className={classNames.join(' ')}
                key={key}
            >
                <button
                    className={styles.button}
                    onClick={onClick}
                >
                    {datum.title}
                </button>
                <a
                    className={styles.link}
                    href={datum.pdf}
                    title={datum.pdf}
                    target="blank"
                >
                    <span className={iconNames.openLink} />
                </a>
            </div>
        );
    }

    render() {
        const { loadingExploreData } = this.state;
        const { exploreData } = this.props;

        return (
            <div className={styles.explore}>
               <div className={styles.content}>
                    {loadingExploreData && <LoadingAnimation />}
                    <ListView
                        data={exploreData}
                        keyExtractor={this.keyExtractor}
                        modifier={this.renderListItem}
                    />
                </div>
                <div className={styles.viewer}>
                    <Viewer />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    exploreData: exploreDataSelector(state),
    selectedExploreData: selectedExploreDataSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setExploreData: (params: SetExploreDataAction) => dispatch(setExploreDataAction(params)),
    setSelectedExplore: (params: SetSelectedExploreAction) =>
        dispatch(setSelectedExploreAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Explore);
