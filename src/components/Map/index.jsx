import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';

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

        this.mapContainer = React.createRef();
        this.layers = Map.createLayers(this.props.layers);
        this.reloadKey = 0;
    }

    componentDidMount() {
        this.map = L.map(this.mapContainer.current)
            .setView([51.505, -0.09], 13);
        this.renderer = L.canvas();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.layers !== nextProps.layers) {
            this.layers = Map.createLayers(nextProps.layers);
            this.reloadKey += 1;
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
                {this.layers.map(layerInfo => (
                    <MapLayer
                        key={`${layerInfo.layerKey}-layer-${this.reloadKey}`}
                        map={this.map}
                        geoJson={layerInfo.geoJson}
                        properties={layerInfo}
                    />
                ))}
            </div>
        );
    }
}
