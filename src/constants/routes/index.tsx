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
        loader: () => import('../../views/Landing'),
        links: allLinks,
        hideNavbar: true,
    },

    dashboard: {
        order: 4,
        type: ROUTE.public,
        path: '/dashboard',
        loader: () => import('../../views/Dashboard'),
        links: allLinks,
    },

    explore: {
        order: 5,
        type: ROUTE.public,
        path: '/explore',
        loader: () => import('../../views/Explore'),
        links: allLinks,
    },

    glossary: {
        order: 6,
        type: ROUTE.public,
        path: '/glossary',
        loader: () => import('../../views/Glossary'),
        links: allLinks,
    },


    // NOTE: 404 page should always be at the end
    notFound: {
        order: 7,
        type: ROUTE.public,
        path: undefined,
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
    route => (props: object) => (
        <ViewManager
            {...props}
            load={route.loader}
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
