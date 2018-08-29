import {
    RestRequest,
    FgRestBuilder,
} from '../../../../vendor/react-store/utils/rest';

import { RequestManager } from '../index';
import {
    MapLayer,
    SetMapLayersAction,
    SetRequestManagerLoadingAction,
} from '../../../../redux/interface';
import {
    urlForMapLayers,
    createParamsForMapLayers,
} from '../../../../rest';
import { Request } from '../../../../rest/interface';
import schema from '../../../../schema';

interface Props {
    setState: RequestManager['setState'];
    setMapLayers(params: SetMapLayersAction): void;
    setLoadings(params: SetRequestManagerLoadingAction): void;
}

export default class MapLayersGetRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (): RestRequest => {
        const request = new FgRestBuilder()
            .url(urlForMapLayers)
            .params(createParamsForMapLayers)
            .preLoad(() => this.props.setLoadings({ loadingLayers: true }))
            .afterLoad(() => this.props.setLoadings({ loadingLayers: false }))
            .success((response: MapLayer[]) => {
                schema.validate(response, 'array.mapLayer');
                const mapLayers = [
                    ...response,
                    {
                        id: 9999,
                        layerName: 'Population',
                        mapBoxUrl: 'https://api.mapbox.com/styles/v1/dfidnepal/cjldwww6i7lh32spkez0ivsee/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGZpZG5lcGFsIiwiYSI6ImNqbGRybDI4bTBlY2Uzd21pNml6cXAxMXAifQ.O5CUa1psf0mrF8ubq7Fy-Q', // tslint:disable
                        type: 'Raster',
                        layerServerUrl: 'Population.NoFile',
                        file: '',
                        sectors: [],
                    },
                ];
                this.props.setMapLayers({ mapLayers });
            })
            .build();
        return request;
    }
}
