import * as topojson  from 'topojson-client';
import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { GeoJSON } from '../../../components/Map/MapLayer';
import {
    createParamsForProvinces,
} from '../../../rest';
import { Request } from '../../../rest/interface';
// import schema from '../../../schema';

interface Props {
    setMapLayerGeoJson(geoJson: GeoJSON): void;
    setGeoJsons(url: string, geoJsons: GeoJSON): void;
}

interface MapLayerGeoJsonParams {
    url: string;
}

export default class MapLayerGeoJsonGetRequest implements Request<MapLayerGeoJsonParams> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = ({ url }: MapLayerGeoJsonParams): RestRequest => {
        const request = new FgRestBuilder()
            .url(url)
            .params(createParamsForProvinces)
            .preLoad()
            .postLoad()
            .success((response: GeoJSON) => {
                // schema.validate(response, 'countryGeoJson');
                let geoJson;
                if (response.type && response.type === 'FeatureCollection') {
                    geoJson = response;
                } else {
                    geoJson = topojson.feature(
                        response,
                        Object.values(response.objects)[0] as any,
                    ) as GeoJSON;
                }
                this.props.setGeoJsons(url, geoJson);
                // Convert ids to strings to make things simpler later
                // geoJson.features.forEach((acc: any) => {
                //     acc.properties[geoJsonIdKey] = `${acc.properties[geoJsonIdKey]}`;
                // });

                this.props.setMapLayerGeoJson(geoJson);
            })
            .build();
        return request;
    }
}
