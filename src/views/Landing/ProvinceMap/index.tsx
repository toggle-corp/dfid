import React from 'react';
import mapboxgl  from 'mapbox-gl';
import * as topojson  from 'topojson-client';
import turf from 'turf';
import {
    createParamsForProvinces,
} from '../../../rest';

// import { Request } from '../../../rest/interface';

import { GeoJSON } from '../../../redux/interface';
import { FgRestBuilder } from '../../../vendor/react-store/utils/rest';
import { getColorOnBgColor } from '../../../vendor/react-store/utils/common';
import Message from '../../../vendor/react-store/components/View/Message';

interface MapMouseEvent extends mapboxgl.MapMouseEvent {
    features: GeoJSON.Feature<mapboxgl.GeoJSONGeometry>;
}

interface OwnProps {
    className?: string;
    onClick(p: number): void;
    onHover(p: number): void;
    colorScheme: string[];
}

type Props = OwnProps;

interface States {
    map?: mapboxgl.Map;
}

const defaultProps = {
    className: '',
};

export default class ProvinceMap extends React.PureComponent<Props, States> {
    mounted: boolean;
    layers: string[];
    sources: string[];
    mapElement: HTMLDivElement;
    unsupportedBrowser: boolean;

    static defaultProps = defaultProps;

    constructor(props: Props) {
        super(props);

        this.layers = [];
        this.sources = [];
        this.state = {
            map: undefined,
        };

        this.mounted = false;
        this.unsupportedBrowser = !mapboxgl.supported();
    }

    componentWillMount() {
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
            container: this.mapElement,
            style: process.env.REACT_APP_MAPBOX_STYLE,
            zoom: 5,
            interactive: false,
            // dragPan: false,
            // scrollZoom: false,
            // doubleClickZoom: false,
        });

        map.on('load', () => {
            // Since the map is loaded asynchronously, make sure
            // we are still mounted before doing setState
            if (this.mounted) {
                const request = this.createRequestForProvinceMap();
                request.start();
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
            this.setState({ map: undefined }, () => {
                map.remove();
            });
        }
    }

    createRequestForProvinceMap = () => {
        const url = 'http://dfid.naxa.com.np/core/geojson/country/';

        const request = new FgRestBuilder()
            .url(url)
            .params(createParamsForProvinces)
            .success((response: GeoJSON) => {
                const geoJson = topojson.feature(
                    response,
                    Object.values(response.objects)[0] as any,
                ) as GeoJSON;

                const { map } = this.state;
                const { colorScheme } = this.props;

                if (map) {
                    const bounds = turf.bbox(geoJson);
                    map.fitBounds(
                        [[
                            bounds[0],
                            bounds[1],
                        ], [
                            bounds[2],
                            bounds[3],
                        ]],
                        { padding: 30 },
                    );

                    map.addSource('province-map', {
                        type: 'geojson',
                        data: geoJson,
                    });

                    const stops = colorScheme.map((val, i) => [(colorScheme.length - i), val]);
                    const textStops = colorScheme.map(
                        (val, i) => [(colorScheme.length - i), getColorOnBgColor(val)],
                    );

                    map.addLayer({
                        id: 'province-map',
                        type: 'fill',
                        source: 'province-map',
                        paint: {
                            'fill-outline-color': '#ffffff',
                            'fill-color': {
                                stops,
                                property: 'Province',
                                type: 'categorical',
                                default: '#088',
                            },
                        },
                    });

                    map.addLayer({
                        id: 'province-map-text',
                        type: 'symbol',
                        source: 'province-map',
                        layout: {
                            'text-field': 'Province {Province}',
                            'text-size': 12,
                        },
                        paint: {
                            'text-color': {
                                stops: textStops,
                                property: 'Province',
                                type: 'categorical',
                                default: '#000',
                            },
                        },
                    });

                    map.addLayer({
                        id: 'province-map-hover',
                        type: 'line',
                        source: 'province-map',
                        paint: {
                            'line-color': '#fff',
                            'line-width': 2.5,
                        },
                        filter: ['==', 'Province', ''],
                    });

                    map.on('click', 'province-map', this.handleMouseClick);
                    map.on('mousemove', 'province-map', this.handleMouseMove);
                    map.on('mouseleave', 'province-map', this.handleMouseLeave);
                }
            })
            .build();

        return request;
    }

    handleMouseClick = (e: MapMouseEvent) => {
        const { onClick } = this.props;
        onClick(e.features[0].properties.Province);
    }

    handleMouseMove = (e: MapMouseEvent) => {
        const { onHover } = this.props;
        const province = e.features[0].properties.Province;
        onHover(province);

        const { map } = this.state;
        if (!map) {
            return;
        }
        map.setFilter('province-map-hover', ['==', 'Province', province]);
        map.getCanvas().style.cursor = 'pointer';
    }

    handleMouseLeave = (e: MapMouseEvent) => {
        const { map } = this.state;
        if (!map) {
            return;
        }
        map.setFilter('province-map-hover', ['==', 'Province', '']);
        map.getCanvas().style.cursor = '';
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

        if (this.unsupportedBrowser) {
            return (
                 <div className={className}>
                    <Message>
                        Your browser doesn't support Mapbox!
                    </Message>
                </div>
            );
        }

        return (
            <div
                className={className}
                ref={(el: HTMLDivElement) => { this.mapElement = el; }}
            />
        );
    }
}
