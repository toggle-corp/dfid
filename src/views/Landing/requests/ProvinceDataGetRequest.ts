import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Landing } from '../index';
import {
    urlForProvinceData,
    createParamsForProvinceData,
} from '../../../rest';
import { Request } from '../../../rest/interface';
import schema from '../../../schema';

interface Props {
    setState: Landing['setState'];
}

export default class ProvinceDataGetRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (): RestRequest => {
        const provinceDataRequest = new FgRestBuilder()
            .url(urlForProvinceData)
            .params(createParamsForProvinceData)
            .success((response: object) => {
                try {
                    schema.validate(response, 'array.provinceData');
                    this.props.setState({ provincesDataFromServer: response });
                } catch (error) {
                    console.warn(error);
                }
            })
            .build();
        return provinceDataRequest;
    }
}
