import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Dashboard } from '../index';
import {
    Indicator,
    SetIndicatorsAction,
} from '../../../redux/interface';
import {
    urlForIndicators,
    createParamsForIndicators,
} from '../../../rest';
import { Request } from '../../../rest/interface';
import schema from '../../../schema';

interface Props {
    setState: Dashboard['setState'];
    setIndicators(params: SetIndicatorsAction): void;
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
            .preLoad(() => this.props.setState({ loadingIndicators: true }))
            .postLoad(() => this.props.setState({ loadingIndicators: false }))
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
