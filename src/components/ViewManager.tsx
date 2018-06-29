import React, { Fragment }  from 'react';
import Helmet from 'react-helmet';

import Bundle from '../vendor/react-store/components/General/Bundle';
import { routes } from '../constants/routes';

interface Props {
    name: string;
    load: () => any; // tslint:disable-line no-any
}

export default class ViewManager extends React.PureComponent<Props, {}> {
    render() {
        const { name, load, ...otherProps } = this.props;
        const title = routes[name].title;

        return (
            <Fragment>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>
                        {title}
                    </title>
                </Helmet>
                <Bundle
                    load={load}
                    {...otherProps}
                />
            </Fragment>
        );
    }
}
