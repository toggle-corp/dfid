import React from 'react';
import { connect } from 'react-redux';

import Message from '../../../vendor/react-store/components/View/Message';
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
    loadingExploreData: boolean;
}

export class Viewer extends React.PureComponent<Props, State> {

    render() {
        const { selectedExploreData } = this.props;

        if (!selectedExploreData) {
            return (
                <Message className={styles.message}>
                    Select a document to preview
                </Message>
            );
        }

        const docUrl = selectedExploreData.pdf;

        if (!docUrl) {
            return (
                <Message>
                    No Pdf
                </Message>
            );
        }

        const googleDriveViewerUrl = createUrlForGoogleViewer(docUrl);

        return (
            <div className={styles.viewer}>
                <iframe
                    className={styles.container}
                    title={docUrl}
                    src={googleDriveViewerUrl}
                    sandbox="allow-scripts allow-same-origin allow-popups"
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
