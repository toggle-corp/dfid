import {
    RestRequest,
    FgRestBuilder,
} from '../../../../vendor/react-store/utils/rest';

import { RequestManager } from '../index';
import {
    Indicator,
    SetIndicatorsAction,
    SetRequestManagerLoadingAction,
} from '../../../../redux/interface';
import {
    urlForIndicators,
    createParamsForIndicators,
} from '../../../../rest';
import { Request } from '../../../../rest/interface';
import schema from '../../../../schema';

interface Props {
    setState: RequestManager['setState'];
    setIndicators(params: SetIndicatorsAction): void;
    setLoadings(params: SetRequestManagerLoadingAction): void;
}

export default class IndicatorsGetRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (): RestRequest => {
        const request = new FgRestBuilder()
            .url(urlForIndicators)
            .params(createParamsForIndicators)
            .preLoad(() => this.props.setLoadings({ loadingIndicators: true }))
            .postLoad(() => this.props.setLoadings({ loadingIndicators: false }))
            .success((response: Indicator[]) => {
                schema.validate(response, 'array.indicator');
                this.props.setIndicators({
                    indicators: response,
                });
            })
            .build();
        return request;
    }
}
