import React from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';

import MapLayer from './MapLayer';
import Legend from './Legend';
import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

export default class Map extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    static createSortedLayers = (layersObj) => {
        const layers = Object.values(layersObj);

        // Sort the layers
        const sortedLayers = layers.sort((l1, l2) => l1.order - l2.order);

        // Create the separate stroke layers
        const sortedLayersSeparate = sortedLayers
            .filter(l => l.separateStroke)
            .map(l => ({
                ...l,
                layerKey: `${l.layerKey}-separate-stroke`,
                types: ['Line'],
            }));

        return [
            ...sortedLayers,
            ...sortedLayersSeparate,
        ];
    }

    // Create legend items from layers which have title and color
    // Perhaps use some defined variable like `showLegend` instead of title and color?
    static createLegendItems = layers => layers
        .filter(l => l.title && l.color)
        .map(layer => ({
            label: layer.title,
            color: layer.color,
        }));

    constructor(props) {
        super(props);

        this.state = {
            map: undefined,
        };

        this.mapContainer = React.createRef();
        this.layers = Map.createSortedLayers(this.props.layers);
        this.legendItems = Map.createLegendItems(this.layers);
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
            this.layers = Map.createSortedLayers(nextProps.layers);
            this.legendItems = Map.createLegendItems(this.layers);
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
            styles.map,
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
                <Legend
                    className={styles.legend}
                    legendItems={this.legendItems}
                />
            </div>
        );
    }
}
