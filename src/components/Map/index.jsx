import React from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';

import html2canvas from 'html2canvas';

import Message from '../../vendor/react-store/components/View/Message';

import styles from './styles.scss';


const nullComponent = () => null;

const propTypes = {
    className: PropTypes.string,
    bounds: PropTypes.arrayOf(PropTypes.number),
    childRenderer: PropTypes.func,
    panelsRenderer: PropTypes.func,
};

const defaultProps = {
    className: '',
    bounds: undefined,
    childRenderer: nullComponent,
    panelsRenderer: nullComponent,
};

export default class Map extends React.Component {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.mapContainer = React.createRef();
        this.leftBottomPanels = React.createRef();
        this.state = {
            map: undefined,
            zoomLevel: 3,
        };

        this.unsupportedBrowser = !mapboxgl.supported();

        if (props.setExportFunction) {
            props.setExportFunction(this.export);
        }
    }

    componentDidMount() {
        if (this.unsupportedBrowser) {
            return;
        }

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
        map.addControl(new mapboxgl.NavigationControl(), 'top-left');

        map.on('load', () => {
            // Since the map is loaded asynchronously, make sure
            // we are still mounted before doing setState
            if (this.mounted) {

                map.loadImage('https://upload.wikimedia.org/wikipedia/commons/e/e6/Lol_circle.png', (error, circle) => {
                    if (!error) {
                        map.addImage('circle', circle);
                    }
                });

                map.loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Ski_trail_rating_symbol-green_circle.svg/600px-Ski_trail_rating_symbol-green_circle.svg.png', (error, circle) => {
                    if (!error) {
                        map.addImage('circle2', circle);
                    }
                });

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

                if (this.mounted) {
                    this.setState({ map });
                }
            }
        });

        map.on('zoom', () => {
            this.setState({
                zoomLevel: map.getZoom(),
            });
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

    export = () => {
        const { map } = this.state;
        if (!map) {
            console.warn('Cannot export as there is no map');
            return;
        }

        const canvas1 = map.getCanvas();

        const legends = this.leftBottomPanels.current.querySelectorAll('.legend, .scale-legend');
        // query selector does not return a list and hence the array spreader used below.
        const promises = Array.from(legends).map(l => html2canvas(l));

        Promise.all(promises).then((canvases) => {
            const canvas3 = document.createElement('canvas');
            canvas3.width = canvas1.width;
            canvas3.height = canvas1.height;

            const context = canvas3.getContext('2d');
            context.drawImage(canvas1, 0, 0);

            let x = 6;
            canvases.forEach((canvas2) => {
                const y = canvas1.height - canvas2.height - 6;
                context.shadowBlur = 4;
                context.shadowColor = "black";
                context.drawImage(canvas2, x, y);
                x += canvas2.width + 6;
            });

            canvas3.toBlob((blob) => {
                const link = document.createElement('a');
                link.download = 'map-export.png';
                link.href = URL.createObjectURL(blob);
                link.click();
            }, 'image/png');
        });
    }

    render() {
        const { childRenderer, panelsRenderer } = this.props;
        const { map } = this.state;

        const className = this.getClassName();
        const Child = childRenderer;
        const Panels = panelsRenderer;

        if (this.unsupportedBrowser) {
            return (
                 <div
                    className={className}
                    ref={this.mapContainer}
                >
                    <Message>
                        Your browser doesn't support Mapbox!
                    </Message>
                </div>
            );
        }

        return (
             <div
                className={className}
                ref={this.mapContainer}
            >
                {map && (
                    <React.Fragment>
                        <Child
                            map={map}
                            zoomLevel={this.state.zoomLevel}
                        />
                        <div
                            className={styles.leftBottomPanels}
                            ref={this.leftBottomPanels}
                        >
                            <Panels
                                map={map}
                                zoomLevel={this.state.zoomLevel}
                            />
                        </div>
                    </React.Fragment>
                )}
            </div>
        );
    }
}
