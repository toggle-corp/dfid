import React from 'react';
import {
    withRouter,
    NavLink,
    RouteComponentProps,
} from 'react-router-dom';

import { reverseRoute } from '../../vendor/react-store/utils/common';
import List from '../../vendor/react-store/components/View/List';
import DropdownMenu from '../../vendor/react-store/components/Action/DropdownMenu';

import {
    iconNames,
    pathNames,
} from '../../constants';
import { CloakSettings } from '../../constants/routes/interface';

import Cloak from '../Cloak';
import * as styles from './styles.scss';

const defaultProps = {
    className: '',
    links: [],
};

type CloakSettingsWithKey = CloakSettings & { key: string };

interface Props extends RouteComponentProps<{}> {
    className?: string;
    links: CloakSettingsWithKey[];
}
interface State {
    navLinks: CloakSettingsWithKey[];
    overflowMenuLinks: CloakSettingsWithKey[];
}

class NavMenu extends React.PureComponent<Props, State> {
    static defaultProps = defaultProps;

    menu: HTMLDivElement | null;

    constructor(props: Props) {
        super(props);

        this.state = {
            navLinks: props.links,
            overflowMenuLinks: [],
        };
    }

    componentWillMount() {
        window.addEventListener('resize', this.handleWindowResize);
    }

    componentDidMount() {
        const overflowMenuLinks = this.computeSize(this.state.navLinks);
        this.setState({ overflowMenuLinks });
    }

    componentWillReceiveProps(nextProps: Props) {
        if (this.props.links !== nextProps.links) {
            const overflowMenuLinks = this.computeSize(nextProps.links);
            this.setState({
                overflowMenuLinks,
                navLinks: nextProps.links,
            });
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
    }

    computeSize = (navLinks: CloakSettingsWithKey[]): CloakSettingsWithKey[] => {
        const overflowMenuLinks: CloakSettingsWithKey[] = [];

        if (!this.menu) {
            return overflowMenuLinks;
        }

        const cr = this.menu.getBoundingClientRect();
        const links = this.menu.getElementsByTagName('a');
        const overflow = this.menu.getElementsByTagName('div')[0];

        const linkWidths = [];
        let totalWidth = 0;

        for (let i = 0; i < links.length; i += 1) {
            links[i].style.display = 'inline-flex';
            const width = links[i].getBoundingClientRect().width;
            linkWidths.push(width);
            totalWidth += width;
        }

        if (this.menu.scrollWidth > Math.ceil(cr.width)) {
            totalWidth += overflow.getBoundingClientRect().width;

            linkWidths.reverse();

            let lastVisibleLinkIndex = links.length - 1;
            while (totalWidth > cr.width) {
                overflowMenuLinks.unshift(navLinks[lastVisibleLinkIndex]);

                totalWidth -= linkWidths[0];
                linkWidths.shift();

                links[lastVisibleLinkIndex].style.display = 'none';
                overflow.style.display = 'inline-flex';
                lastVisibleLinkIndex -= 1;

                if (lastVisibleLinkIndex < 0) {
                    break;
                }
            }
        } else {
            overflow.style.display = 'none';

            for (let i = 0; i < links.length; i += 1) {
                links[i].style.display = 'inline-flex';
            }
        }

        return overflowMenuLinks;
    }

    renderNavItem = (key: string, item: CloakSettingsWithKey, className: string) => {
        const params = {
            // projectId, countryId
        };
        const renderFn = () => (
            <NavLink
                activeClassName={styles.active}
                to={reverseRoute(pathNames[key], params)}
                className={className}
                exact
            >
                {key}
            </NavLink>
        );

        return (
            <Cloak
                key={key}
                requireLogin={item.requireLogin}
                requireAdminRights={item.requireAdminRights}
                requireDevMode={item.requireDevMode}
                render={renderFn}
            />
        );
    }

    renderNavbarItem = (key: string, item: CloakSettingsWithKey) => (
        this.renderNavItem(key, item, styles.menuItem)
    )

    renderOverflowMenuItem = (key: string, item: CloakSettingsWithKey) => (
        this.renderNavItem(key, item, `${styles.overflowMenuItem} ${styles.dropdownItem}`)
    )

    keyExtractor = (d: CloakSettingsWithKey): string => d.key;

    handleWindowResize = () => {
        const overflowMenuLinks = this.computeSize(this.state.navLinks);
        this.setState({ overflowMenuLinks });
    }

    render() {
        const { className } = this.props;

        const {
            navLinks,
            overflowMenuLinks,
        } = this.state;

        return (
            <div
                ref={(el) => { this.menu = el; }}
                className={`${styles.navMenu} ${className}`}
            >
                <List
                    data={navLinks}
                    modifier={this.renderNavbarItem}
                    keyExtractor={this.keyExtractor}
                />

                <DropdownMenu
                    iconName={iconNames.overflowHorizontal}
                    className={styles.overflowMenu}
                    dropdownClassName={styles.navbarOverflowDropdown}
                    hideDropdownIcon
                >
                    <List
                        data={overflowMenuLinks}
                        modifier={this.renderOverflowMenuItem}
                        keyExtractor={this.keyExtractor}
                    />
                </DropdownMenu>
            </div>
        );
    }
}

export default withRouter(NavMenu);
