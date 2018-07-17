import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';


const propTypes = {
    map: PropTypes.object,
    layerKey: PropTypes.string.isRequired,
    tiles: PropTypes.array.isRequired,
    tileSize: PropTypes.number,
};

const defaultProps = {
    map: undefined,
    tileSize: 256,
};


export default class RasterLayer extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    componentDidMount() {
        this.create(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.map !== nextProps.map) {
            this.destroy();
            this.create(nextProps);
        }
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy = () => {
        const { map } = this.props;
        if (map) {
            if (this.layer) {
                map.removeLayer(this.layer);
            }
            if (this.source) {
                map.removeSource(this.source);
            }
        }
        this.layer = undefined;
        this.source = undefined;
    }

    create = (props) => {
        const {
            map,
            layerKey,
            tiles,
            tileSize,
        } = props;

        map.addSource(layerKey, {
            type: 'raster',
            tiles,
            tileSize,
        });
        this.source = layerKey;

        map.addLayer({
            id: layerKey,
            type: 'raster',
            source: layerKey,
            paint: {},
        });
        this.layer = layerKey;
    }

    render() {
        return null;
    }
}
