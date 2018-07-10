import React, { Fragment } from 'react';
import Redux from 'redux';
import {
    Switch,
    Route,
    withRouter,
    RouteComponentProps,
} from 'react-router-dom';
import { connect } from 'react-redux';

import Navbar from './components/Navbar';
import PrivateRoute from './vendor/react-store/components/General/PrivateRoute';
import ExclusivelyPublicRoute from './vendor/react-store/components/General/ExclusivelyPublicRoute';
import Toast from './vendor/react-store/components/View/Toast';

import { RootState, Notification } from './redux/interface';
import {
    authenticatedSelector,
    lastNotifySelector,
    notifyHideAction,
} from './redux';
import { pathNames, views, routes, routesOrder } from './constants';
import { ROUTE } from './constants/routes/interface';

interface OwnProps extends RouteComponentProps<{}> {}
interface PropsFromDispatch {
    notifyHide(): void;
}
interface PropsFromState {
    authenticated: boolean;
    lastNotify: Notification;
}
type Props = OwnProps & PropsFromState & PropsFromDispatch;

class Multiplexer extends React.PureComponent<Props, {}> {

    handleToastClose = () => {
        this.props.notifyHide();
    }

    renderRoute = (routeId: string): (JSX.Element|null) => {
        const path = pathNames[routeId];

        const viewComponent = views[routeId];
        if (!viewComponent) {
            console.error(`View not associated with ${routeId}`);
            return null;
        }

        const { authenticated } = this.props;

        const route = routes[routeId];
        const { redirectTo, type: routeType } = route;

        switch (routeType) {
            case ROUTE.exclusivelyPublic:
                return (
                    <ExclusivelyPublicRoute
                        component={viewComponent}
                        key={routeId}
                        path={path}
                        exact={true}

                        authenticated={authenticated}
                        redirectLink={redirectTo}
                    />
                );
            case ROUTE.private:
                return (
                    <PrivateRoute
                        component={viewComponent}
                        key={routeId}
                        path={path}
                        exact={true}

                        authenticated={authenticated}
                        redirectLink={redirectTo}
                    />
                );
            case ROUTE.public:
                return (
                    <Route
                        component={viewComponent}
                        key={routeId}
                        path={path}
                        exact={true}
                    />
                );
            default:
                console.error(`Invalid route type ${routes[routeId].type}`);
                return null;
        }
    }

    render() {
        const { lastNotify } = this.props;

        return (
            <Fragment>
                <Toast
                    notification={lastNotify}
                    onClose={this.handleToastClose}
                />
                <Navbar className="navbar" />
                <div className="dfid-main-content">
                    <Switch>
                        {routesOrder.map(routeId => this.renderRoute(routeId))}
                    </Switch>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    authenticated: authenticatedSelector(state),
    lastNotify: lastNotifySelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    notifyHide: () => dispatch(notifyHideAction()),
});

export default withRouter(
    connect<PropsFromState, PropsFromDispatch, OwnProps>(
        mapStateToProps,
        mapDispatchToProps,
    )(Multiplexer),
);
