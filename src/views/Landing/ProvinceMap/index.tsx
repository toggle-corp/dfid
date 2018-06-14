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

    static defaultProps = defaultProps;

    constructor(props: Props) {
        super(props);

        this.layers = [];
        this.sources = [];
        this.state = {
            map: undefined,
        };
    }

    componentWillMount() {
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
                    map.addSource('province-map', {
                        type: 'geojson',
                        data: geoJson,
                    });

                    const paint = {
                        'fill-color': '#1676d3',
                        // 'fill-opacity': 0.5,
                        'fill-outline-color': '#ffffff',
                    };

                    map.addLayer({
                        paint,
                        id: 'province-map',
                        type: 'fill',
                        source: 'province-map',
                    });

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

                    map.addLayer({
                        id: 'province-hover',
                        type: 'fill',
                        source: 'province-map',
                        paint: {
                            'fill-color': '#00f',
                            'fill-opacity': 1,
                        },
                        filter: ['==', 'Province', ''],
                    });

                    const stops = colorScheme.map((val, i) => [(i + 1), val]);

                    map.setPaintProperty('province-map', 'fill-color', {
                        stops,
                        property: 'Province',
                        type: 'categorical',
                        default: '#088',
                    });

                    map.on('click', 'province-map', this.handleMouseClick);
                    map.on('mouseenter', 'province-map', this.handleMouseEnter);
                }
            })
            .build();

        return request;
    }

    handleMouseClick = (e: MapMouseEvent) => {
        const { onClick } = this.props;
        onClick(e.features[0].properties.Province);
    }

    handleMouseEnter = (e: MapMouseEvent) => {
        const { onHover } = this.props;
        onHover(e.features[0].properties.Province);
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
        // const { map } = this.state;
        return (
            <div
                className={className}
                ref={(el: HTMLDivElement) => { this.mapElement = el; }}
            />
        );
    }
}
