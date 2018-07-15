import React from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';

import styles from './styles.scss';

const nullComponent = () => null;

const propTypes = {
    className: PropTypes.string,
    bounds: PropTypes.arrayOf(PropTypes.number),
    childRenderer: PropTypes.node,
};

const defaultProps = {
    className: '',
    bounds: undefined,
    childRenderer: nullComponent,
};

export default class Map extends React.Component {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.mapContainer = React.createRef();
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
            center: [84.1240, 28.3949], // longitude, latitude of nepal
            container: this.mapContainer.current,
            style: process.env.REACT_APP_MAPBOX_STYLE,
            zoom: 3,
            minZoom: 3,
            maxZoom: 10,
            logoPosition: 'bottom-right',
            doubleClickZoom: false,
            preserveDrawingBuffer: true,
            // failIfMajorPerformanceCaveat: true,
            // maxBounds: [[76.477634, 25.361567], [92.338761, 31.891382]],
        });

        map.on('load', () => {
            // Since the map is loaded asynchronously, make sure
            // we are still mounted before doing setState
            if (this.mounted) {
                map.loadImage('https://upload.wikimedia.org/wikipedia/commons/e/e6/Lol_circle.png', (error, circle) => {
                    const { bounds } = this.props;
                    if (bounds) {
                        map.fitBounds(
                            [[
                                bounds[0],
                                bounds[1],
                            ], [
                                bounds[2],
                                bounds[3],
                            ]],
                            { padding: 128 },
                        );
                    }
                    map.addImage('circle', circle);

                    if (this.mounted) {
                        this.setState({ map });
                    }
                });
            }
        });

        setTimeout(() => { map.resize(); }, 200);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.bounds !== nextProps.bounds && this.state.map) {
            const { bounds } = nextProps.props;
            const { map } = this.state;
            if (bounds) {
                map.fitBounds(
                    [[
                        bounds[0],
                        bounds[1],
                    ], [
                        bounds[2],
                        bounds[3],
                    ]],
                    { padding: 128 },
                );
            }
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
        const { childRenderer } = this.props;
        const { map } = this.state;

        const className = this.getClassName();
        const Child = childRenderer;

        return (
             <div
                className={className}
                ref={this.mapContainer}
            >
                {map && <Child map={map} />}
            </div>
        );
    }
}
