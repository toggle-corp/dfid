import React from 'react';
import {
    withRouter,
    Link,
    matchPath,
    RouteComponentProps,
} from 'react-router-dom';

import { reverseRoute } from '../../vendor/react-store/utils/common';

import {
    pathNames,
    validLinks,
    hideNavbar,
    extendedNavbar,
} from '../../constants';
import { CloakSettings } from '../../constants/routes/interface';

import logo from '../../resources/img/logo.png';

import NavMenu from './NavMenu';
// import NavDrop from './NavDrop';
import * as styles from './styles.scss';

const defaultProps = {
    className: '',
};

// FIXME: use Generics
// tslint:disable-next-line no-any
const getKeyByValue = (obj: object, value: any) => (
    Object.keys(obj).find(key => obj[key] === value)
);

type CloakSettingsWithKey = CloakSettings & { key: string };

interface Props extends RouteComponentProps<{}> {
    className?: string;
}
interface State {}

class Navbar extends React.PureComponent<Props, State> {
    static defaultProps = defaultProps;

    currentMatch?: Props['match'];
    currentPath: string;
    validNavLinks: CloakSettingsWithKey[];
    // validDropLinks: CloakSettingsWithKey[];

    static getCurrentMatch = (location: Props['location']): Props['match'] | undefined => {
        const links = Object.keys(pathNames);
        const paths = links.map(link => pathNames[link]);

        for (let i = 0; i < links.length; i += 1) {
            const match = matchPath(location.pathname, {
                path: paths[i],
                exact: true,
            });

            if (match) {
                return match;
            }
        }

        return undefined;
    }

    static getValidLinks = (navLinks: string[], currentPath: string): CloakSettingsWithKey[] => {
        const currentValidLinks = validLinks[currentPath];

        return navLinks
            .map(link => ({ key: link, ...currentValidLinks[link] }))
            .filter(d => !!d);
    }

    constructor(props: Props) {
        super(props);

        this.setLinksForLocation(this.props.location);
    }

    componentWillReceiveProps(nextProps: Props) {
        const { location: oldLocation } = this.props;
        const { location: newLocation } = nextProps;
        if (oldLocation !== newLocation) {
            this.setLinksForLocation(newLocation);
        }
    }

    setLinksForLocation = (location: Props['location']) => {
        this.currentMatch = Navbar.getCurrentMatch(location);

        const pathFromMatch = this.currentMatch && getKeyByValue(pathNames, this.currentMatch.path);
        this.currentPath = pathFromMatch || 'notFound';

        const navLinks = [
            'dashboard',
            'infographics', // NOTE: this is the explore page src/Explore
            'glossary',
        ];

        /*
        const dropLinks: string[] = [
            'dashboard',
            'explore',
        ];
        */

        this.validNavLinks = Navbar.getValidLinks(navLinks, this.currentPath);
        // this.validDropLinks = Navbar.getValidLinks(dropLinks, this.currentPath);
    }

    render() {
        const {
            className,
        } = this.props;
        const navClassNames = [className];
        const menuClassNames = [styles.mainMenu];
        const extended = extendedNavbar[this.currentPath];

        // Hide navbar
        if (hideNavbar[this.currentPath]) {
            return <span className="no-nav" />;
        }

        if (extended) {
            navClassNames.push(styles.extended);
            navClassNames.push('navbar-extended');
            menuClassNames.push(styles.extendedMenu);
        }

        return (
            <nav className={`${styles.navbar} ${navClassNames.join(' ')}`}>
                <Link
                    to={reverseRoute(pathNames.landing, {})}
                    className={styles.brand}
                >
                    {
                    extended ?
                            <img
                                className={styles.logo}
                                src={logo}
                            />
                        :
                            <div className={styles.brand}>
                                DFID Nepal
                            </div>
                    }
                </Link>
                <NavMenu
                    links={this.validNavLinks}
                    className={menuClassNames.join(' ')}
                />
                {/*
                <NavDrop
                    links={this.validDropLinks}
                    className={styles.userMenu}
                />
                */}
            </nav>
        );
    }
}

export default withRouter(Navbar);
