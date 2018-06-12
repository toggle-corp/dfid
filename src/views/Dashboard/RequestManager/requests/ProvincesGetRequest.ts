import {
    RestRequest,
    FgRestBuilder,
} from '../../../../vendor/react-store/utils/rest';

import { RequestManager } from '../index';
import {
    Province,
    SetProvincesAction,
    SetRequestManagerLoadingAction,
} from '../../../../redux/interface';
import {
    urlForProvinces,
    createParamsForProvinces,
} from '../../../../rest';
import { Request } from '../../../../rest/interface';
import schema from '../../../../schema';

interface Props {
    setState: RequestManager['setState'];
    setProvinces(params: SetProvincesAction): void;
    setLoadings(params: SetRequestManagerLoadingAction): void;
}

export default class ProvincesGetRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (): RestRequest => {
        const provincesRequest = new FgRestBuilder()
            .url(urlForProvinces)
            .params(createParamsForProvinces)
            .preLoad(() => this.props.setLoadings({ loadingProvinces: true }))
            .afterLoad(() => this.props.setLoadings({ loadingProvinces: false }))
            .success((response: Province[]) => {
                try {
                    schema.validate(response, 'array.province');
                    this.props.setProvinces({ provinces: response });
                } catch (error) {
                    console.warn(error);
                }
            })
            .build();
        return provincesRequest;
    }
}
