import React, { Fragment }  from 'react';
import Helmet from 'react-helmet';

import Bundle from '../vendor/react-store/components/General/Bundle';

interface Props {
    load: () => any; // tslint:disable-line no-any
}

export default class ViewManager extends React.PureComponent<Props, {}> {
    render() {
        const { load, ...otherProps } = this.props;
        return (
            <Fragment>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>
                        {/* TODO: use dynamic strings here */}
                        DFID
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
