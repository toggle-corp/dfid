import React from 'react';
import ViewManager from '../../components/ViewManager';
import { mapObjectToArray, mapObjectToObject, Map } from '../../utils/map';
import { allLinks } from './links';
import { RouteSetting, ROUTE, CloakSettings } from './interface';

// NOTE: only change values in routes
export const routes: Map<RouteSetting> = {
    landing: {
        order: 3,
        type: ROUTE.public,
        path: '/',
        title: 'DFID',
        loader: () => import('../../views/Landing'),
        links: allLinks,
        extendedNavbar: true,
    },

    dashboard: {
        order: 4,
        type: ROUTE.public,
        path: '/dashboard',
        title: 'Dashboard',
        loader: () => import('../../views/Dashboard'),
        links: allLinks,
    },

    explore: {
        order: 5,
        type: ROUTE.public,
        path: '/explore',
        title: 'Explore',
        loader: () => import('../../views/Explore'),
        links: allLinks,
    },

    glossary: {
        order: 6,
        type: ROUTE.public,
        path: '/glossary',
        title: 'Glossary',
        loader: () => import('../../views/Glossary'),
        links: allLinks,
    },


    // NOTE: 404 page should always be at the end
    notFound: {
        order: 7,
        type: ROUTE.public,
        path: undefined,
        title: 'Page not found',
        loader: () => import('../../views/NotFound'),
        links: allLinks,
    },
};

export const routesOrder: string[] = mapObjectToArray<RouteSetting, { key: string, order: number }>(
    routes,
    (route, key) => ({ key, order: route.order }),
)
    .sort((a, b) => a.order - b.order)
    .map(row => row.key);

export const views = mapObjectToObject<RouteSetting, (props: object) => JSX.Element>(
    routes,
    (route, name) => (props: object) => (
        <ViewManager
            {...props}
            load={route.loader}
            name={name}
        />
    ),
);

export const pathNames = mapObjectToObject<RouteSetting, string | undefined>(
    routes,
    route => route.path,
);

export const validLinks = mapObjectToObject<RouteSetting, CloakSettings>(
    routes,
    route => route.links,
);

export const hideNavbar = mapObjectToObject<RouteSetting, boolean>(
    routes,
    route => !!route.hideNavbar,
);

export const extendedNavbar = mapObjectToObject<RouteSetting, boolean>(
    routes,
    route => !!route.extendedNavbar,
);
