import React from 'react';
import { connect } from 'react-redux';

import Message from '../../../vendor/react-store/components/View/Message';
import LoadingAnimation from '../../../vendor/react-store/components/View/LoadingAnimation';
import {
    RootState,
    ExploreData,
} from '../../../redux/interface';
import { selectedExploreDataSelector } from '../../../redux';
import { createUrlForGoogleViewer } from '../../../rest';

import styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    selectedExploreData?: ExploreData;
}
interface PropsFromDispatch {}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State {
    loadingIframe: boolean;
}

export class Viewer extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { loadingIframe: false };
    }

    componentWillReceiveProps(nextProps: Props) {
        const { selectedExploreData: explore } = nextProps;
        const { selectedExploreData: oldExplore = {} as ExploreData } = this.props;
        if (explore && (explore.pdf !== oldExplore.pdf)) {
            this.setState({ loadingIframe: true });
        }
    }

    onIframeLoad = () => {
        this.setState({ loadingIframe: false });
    }

    render() {
        const { loadingIframe } = this.state;
        const { selectedExploreData } = this.props;

        if (!selectedExploreData) {
            return (
                <Message className={styles.message}>
                    Select a document to preview
                </Message>
            );
        }

        const url = selectedExploreData.pdf;

        if (!url) {
            return (
                <Message>
                    No Pdf
                </Message>
            );
        }

        const googleDriveViewerUrl = createUrlForGoogleViewer(url);

        return (
            <div className={styles.viewer}>
                {loadingIframe && <LoadingAnimation />}
                <iframe
                    className={styles.container}
                    title={url}
                    src={googleDriveViewerUrl}
                    sandbox="allow-scripts allow-same-origin allow-popups"
                    onLoad={this.onIframeLoad}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    selectedExploreData: selectedExploreDataSelector(state),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps,
)(Viewer);
