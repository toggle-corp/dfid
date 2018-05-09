import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Dashboard } from '../index';
import { Province } from '../../../redux/interface';
import {
    urlForProvinces,
    createParamsForProvinces,
} from '../../../rest';
import { Request } from '../../../rest/interface';
import schema from '../../../schema';

interface Props {
    setState: Dashboard['setState'];
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
            .preLoad(() => this.props.setState({ loadingProvinces: true }))
            .postLoad(() => this.props.setState({ loadingProvinces: false }))
            .success((response: Province[]) => {
                try {
                    schema.validate(response, 'array.province');
                    this.props.setState({ provinces: response });
                } catch (error) {
                    console.warn(error);
                }
            })
            .build();
        return provincesRequest;
    }
}
