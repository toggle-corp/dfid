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
            .preLoad(() => this.props.setLoadings({ loadingIndicators: true }))
            .postLoad(() => this.props.setLoadings({ loadingIndicators: false }))
            .success((response: MapLayer[]) => {
                schema.validate(response, 'array.mapLayer');
                this.props.setMapLayers({
                    mapLayers: response,
                });
            })
            .build();
        return request;
    }
}
