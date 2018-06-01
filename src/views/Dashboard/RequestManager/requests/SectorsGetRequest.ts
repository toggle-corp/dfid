import {
    RestRequest,
    FgRestBuilder,
} from '../../../../vendor/react-store/utils/rest';

import { RequestManager } from '../index';
import {
    Sector,
    SetSectorsAction,
    SetRequestManagerLoadingAction,
} from '../../../../redux/interface';
import {
    urlForSectors,
    createParamsForSectors,
} from '../../../../rest';
import { Request } from '../../../../rest/interface';
import schema from '../../../../schema';

interface Props {
    setState: RequestManager['setState'];
    setSectors(params: SetSectorsAction): void;
    setLoadings(params: SetRequestManagerLoadingAction): void;
}

export default class SectorsGetRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (): RestRequest => {
        const sectorsRequest = new FgRestBuilder()
            .url(urlForSectors)
            .params(createParamsForSectors)
            .preLoad(() => this.props.setLoadings({ loadingSectors: true }))
            .postLoad(() => this.props.setLoadings({ loadingSectors: false }))
            .success((response: Sector[]) => {
                try {
                    schema.validate(response, 'array.sector');
                    this.props.setSectors({ sectors: response });
                } catch (error) {
                    console.warn(error);
                }
            })
            .build();
        return sectorsRequest;
    }
}
