import React from 'react';
import mapboxgl from 'mapbox-gl';
import { MapContext } from './MapLayer';

interface OwnProps {
    className: string;
    children?: React.ReactNode;
}

type Props = OwnProps;

interface States {
    map?: mapboxgl.Map;
}

const defaultProps = {
    className: '',
};


export default class Map extends React.PureComponent<Props, States> {
    mounted: boolean;
    layers: string[];
    sources: string[];
    mapElement: HTMLDivElement;

    static defaultProps = defaultProps;

    constructor(props: Props) {
        super(props);

        this.layers = [];
        this.sources = [];
        this.state = {
            map: undefined,
        };
    }

    componentDidMount() {
        this.mounted = true;

        const { REACT_APP_MAPBOX_ACCESS_TOKEN: token } = process.env;
        // Add the mapbox map
        if (token) {
            mapboxgl.accessToken = token;
        }
        const map = new mapboxgl.Map({
            center: [50, 10],
            container: this.mapElement,
            style: process.env.REACT_APP_MAPBOX_STYLE,
            zoom: 2,
        });

        map.on('load', () => {
            // Since the map is loaded asynchronously, make sure
            // we are still mounted before doing setState
            if (this.mounted) {
                this.setState({ map });
            }
        });

        setTimeout(() => { map.resize(); }, 200);
    }

    componentWillUnmount() {
        this.mounted = false;

        // Remove the mapbox map
        const { map } = this.state;
        if (map) {
            map.remove();
        }
    }

    getClassName() {
        const { className } = this.props;
        const classNames = [
            className,
            'map',
        ];
        return classNames.join(' ');
    }

    render() {
        const className = this.getClassName();
        const { children } = this.props;
        const { map } = this.state;

        const mapContextData = {
            map,
        };

        return (
            <div
                className={className}
                ref={(el: HTMLDivElement) => { this.mapElement = el; }}
            >
                <MapContext.Provider value={mapContextData}>
                    {children}
                </MapContext.Provider>
            </div>
        );
    }
}
