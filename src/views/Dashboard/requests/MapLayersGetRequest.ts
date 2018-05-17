import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Dashboard } from '../index';
import {
    MapLayer,
    SetMapLayersAction,
} from '../../../redux/interface';
import {
    urlForMapLayers,
    createParamsForMapLayers,
} from '../../../rest';
import { Request } from '../../../rest/interface';
import schema from '../../../schema';

interface Props {
    setState: Dashboard['setState'];
    setMapLayers(params: SetMapLayersAction): void;
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
            .preLoad(() => this.props.setState({ loadingIndicators: true }))
            .postLoad(() => this.props.setState({ loadingIndicators: false }))
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
