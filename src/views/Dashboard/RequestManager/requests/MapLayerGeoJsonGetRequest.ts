import * as topojson  from 'topojson-client';
import {
    RestRequest,
    FgRestBuilder,
} from '../../../../vendor/react-store/utils/rest';
import { Coordinator } from '../../../../vendor/react-store/utils/coordinate';

import {
    createParamsForProvinces,
} from '../../../../rest';
import { Request } from '../../../../rest/interface';
import {
    SetGeoJsonsAction,
    GeoJSON,
} from '../../../../redux/interface';
// import schema from '../../../schema';

interface Props {
    setMapLayerGeoJson(geoJson: GeoJSON): void;
    setGeoJsons: (params: SetGeoJsonsAction) => void;
    getCoordinator: () => Coordinator;
}

interface MapLayerGeoJsonParams {
    url: string;
    key: string;
}

export default class MapLayerGeoJsonGetRequest implements Request<MapLayerGeoJsonParams> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = ({ url, key }: MapLayerGeoJsonParams): RestRequest => {
        const request = new FgRestBuilder()
            .url(url)
            .params(createParamsForProvinces)
            .postLoad(() => {
                this.props.getCoordinator().notifyComplete(key);
            })
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
                this.props.setGeoJsons({ [url]: geoJson });
                this.props.setMapLayerGeoJson(geoJson);
            })
            .build();
        return request;
    }
}
