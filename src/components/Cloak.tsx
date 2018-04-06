import React from 'react';
import { connect } from 'react-redux';

import { activeUserSelector } from '../redux';
import { RootState, ActiveUser } from '../redux/interface';

const defaultProps = {
    activeUser: {},

    requireAdminRights: false,
    requireLogin: false,
    requireDevMode: false,
};

interface OwnProps {
    requireAdminRights?: boolean;
    requireLogin?: boolean;
    requireDevMode?: boolean;
    render(): JSX.Element;
}
interface PropsFromDispatch {
}
interface PropsFromState {
    activeUser: ActiveUser;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

class Cloak extends React.PureComponent<Props, {}> {
    static defaultProps = defaultProps;

    render() {
        const {
            activeUser: { userId, isSuperuser },

            requireAdminRights,
            requireLogin,
            requireDevMode,
            render,
        } = this.props;

        if (requireDevMode && process.env.NODE_ENV !== 'development') {
            return null;
        }
        if (requireLogin && !userId) {
            return null;
        }
        if (requireAdminRights && !isSuperuser) {
            return null;
        }
        return render();
    }
}

const mapStateToProps = (state: RootState) => ({
    activeUser: activeUserSelector(state),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(mapStateToProps)(Cloak);
