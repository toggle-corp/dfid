import * as topojson  from 'topojson-client';
import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Dashboard } from '../index';
import { GeoJSON } from '../../../components/Map';
import {
    createParamsForProvinces,
} from '../../../rest';
import { Request } from '../../../rest/interface';
// import schema from '../../../schema';

interface Props {
    setState: Dashboard['setState'];
    setGeoJsons(url: string, geoJsons: GeoJSON): void;
}

interface MapLayerGeoJsonParams {
    url: string;
    type: string;
}

export default class MapLayerGeoJsonGetRequest implements Request<MapLayerGeoJsonParams> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = ({ url, type }: MapLayerGeoJsonParams): RestRequest => {
        const request = new FgRestBuilder()
            .url(url)
            .params(createParamsForProvinces)
            .preLoad()
            .postLoad()
            .success((response: GeoJSON) => {
                // schema.validate(response, 'countryGeoJson');
                const geoJson = topojson.feature(
                    response,
                    Object.values(response.objects)[0] as any,
                ) as GeoJSON;
                this.props.setGeoJsons(url, geoJson);
                // Convert ids to strings to make things simpler later
                // geoJson.features.forEach((acc: any) => {
                //     acc.properties[geoJsonIdKey] = `${acc.properties[geoJsonIdKey]}`;
                // });
                this.props.setState({
                    mapLayerGeoJson: geoJson,
                    mapLayerType: type,
                });
            })
            .build();
        return request;
    }
}
