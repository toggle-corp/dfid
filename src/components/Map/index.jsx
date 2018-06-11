import React from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';

import MapLayer from './MapLayer';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

export default class Map extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    static createLayers = layers => Object.values(layers)
        .sort((l1, l2) => l1.order - l2.order);

    constructor(props) {
        super(props);

        this.state = {
            map: undefined,
        };

        this.mapContainer = React.createRef();
        this.layers = Map.createLayers(this.props.layers);
        this.reloadKey = 0;
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
            container: this.mapContainer.current,
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

    componentWillReceiveProps(nextProps) {
        if (this.props.layers !== nextProps.layers) {
            this.layers = Map.createLayers(nextProps.layers);
            this.reloadKey += 1;
        }
    }

    componentWillUnmount() {
        this.mounted = false;

        // Remove the mapbox map
        const { map } = this.state;
        if (map) {
            this.setState({ map: undefined }, () => {
                map.remove();
            });
        }
    }

    getClassName = () => {
        const { className } = this.props;

        const classNames = [
            className,
        ];

        return classNames.join(' ');
    }

    render() {
        const className = this.getClassName();
        return (
             <div
                className={className}
                ref={this.mapContainer}
            >
                {this.state.map && this.layers.map(layerInfo => (
                    <MapLayer
                        key={`${layerInfo.layerKey}-layer-${this.reloadKey}`}
                        map={this.state.map}
                        geoJson={layerInfo.geoJson}
                        properties={layerInfo}
                    />
                ))}
            </div>
        );
    }
}
