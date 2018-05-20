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

interface CountryGeoParams {
    url: string;
    geoJsonIdKey: string;
    geoJsonLabelKey: string ;
}

export default class CountryGeoJsonGetRequest implements Request<CountryGeoParams> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = ({ url, geoJsonIdKey, geoJsonLabelKey }: CountryGeoParams): RestRequest => {
        const request = new FgRestBuilder()
            .url(url)
            .params(createParamsForProvinces)
            .preLoad(() => this.props.setState({ loadingGeoJson: true }))
            .postLoad(() => this.props.setState({ loadingGeoJson: false }))
            .success((response: GeoJSON) => {
                // schema.validate(response, 'countryGeoJson');
                const geoJson = topojson.feature(
                    response,
                    Object.values(response.objects)[0] as any,
                ) as GeoJSON;
                this.props.setGeoJsons(url, geoJson);
                // Convert ids to strings to make things simpler later
                geoJson.features.forEach((acc: any) => {
                    acc.properties[geoJsonIdKey] = `${acc.properties[geoJsonIdKey]}`;
                });
                this.props.setState({
                    geoJsonIdKey,
                    geoJsonLabelKey,
                    geoJson,
                });
            })
            .build();
        return request;
    }
}
