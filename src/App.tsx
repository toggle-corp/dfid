import * as React from 'react';
import * as Redux from 'redux';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { RootState } from './redux/interface';
import { startTasksAction } from './redux/middlewares/taskManager';
import { ravenInitialize } from './config/sentry';
import Multiplexer from './Multiplexer';

interface OwnProps {}
interface PropsFromDispatch {
    startTasks(): void;
}
interface State {
}
interface PropsFromState {
}
type Props = OwnProps & PropsFromState & PropsFromDispatch;

export class App extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = { pending: false };
    }

    componentWillMount() {
        this.props.startTasks();
        ravenInitialize();
    }

    render() {
        return (
            <BrowserRouter>
                <Multiplexer />
            </BrowserRouter>
        );
    }
}

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    startTasks: () => dispatch(startTasksAction()),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    undefined, mapDispatchToProps,
)(App);
