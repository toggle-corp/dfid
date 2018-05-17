import * as React from 'react';
import * as Redux from 'redux';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { RestRequest, FgRestBuilder } from './vendor/react-store/utils/rest';
import { RootState, Token } from './redux/interface';
import {
    authenticatedSelector,
    tokenSelector,
    setAccessTokenAction,
} from './redux';
import { startTasksAction } from './redux/middlewares/taskManager';
import {
    createParamsForTokenRefresh,
    urlForTokenRefresh,
} from './rest';
import schema from './schema';
import Multiplexer from './Multiplexer';

interface OwnProps {}
interface PropsFromDispatch {
    setAccessToken(access: string, userId: number): void;
    startTasks(): void;
}
interface State {
    pending: boolean;
}
interface PropsFromState {
    authenticated: boolean;
    token: Token;
}
type Props = OwnProps & PropsFromState & PropsFromDispatch;

// NOTE: Handles loading of requests (eg: loading user info, etc)
export class App extends React.PureComponent<Props, State> {
    refreshRequest: RestRequest;

    constructor(props: Props) {
        super(props);

        this.state = { pending: false };
    }

    /*
    componentWillMount() {
        if (this.props.authenticated) {
            this.refreshRequest = this.createRequestForRefresh();
            this.refreshRequest.start();
        }
    }
    */

    componentWillUnmount() {
        if (this.refreshRequest) {
            this.refreshRequest.stop();
        }
    }

    createRequestForRefresh = () => {
        // NOTE: at this point refresh must be defined
        const { refresh = '' } = this.props.token;
        const refreshRequest = new FgRestBuilder()
            .url(urlForTokenRefresh)
            .params(() => createParamsForTokenRefresh({ refresh }))
            .success((response: { access: string, userId: number }) => {
                try {
                    schema.validate(response, 'tokenRefreshResponse');
                    const { access, userId } = response;
                    this.props.startTasks();
                    this.props.setAccessToken(access, userId);
                    this.setState({ pending: false });
                } catch (er) {
                    console.error(er);
                }
            })
            .failure((response: object) => {
                console.info('FAILURE:', response);
                // TODO: logout
            })
            .fatal((response: object) => {
                console.info('FATAL:', response);
                // TODO: some error
            })
            .build();
        return refreshRequest;
    }

    render() {
        if (this.props.authenticated && this.state.pending) {
            return (
                <div>
                    Checking with server
                </div>
            );
        }

        return (
            <BrowserRouter>
                <Multiplexer />
            </BrowserRouter>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    authenticated: authenticatedSelector(state),
    token: tokenSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setAccessToken: (access: string, userId: number) =>
        dispatch(setAccessTokenAction(access, userId)),
    startTasks: () => dispatch(startTasksAction()),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(App);
