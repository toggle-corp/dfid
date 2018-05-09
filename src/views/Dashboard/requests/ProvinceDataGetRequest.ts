import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Dashboard } from '../index';
import { ProvinceData } from '../../../redux/interface';
import {
    urlForProvinceData,
    createParamsForProvinceData,
} from '../../../rest';
import { Request } from '../../../rest/interface';
import schema from '../../../schema';

interface Props {
    setState: Dashboard['setState'];
}

export default class ProvinceDataGetRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (): RestRequest => {
        const provinceDataGetRequest = new FgRestBuilder()
            .url(urlForProvinceData)
            .params(createParamsForProvinceData)
            .preLoad(() => this.props.setState({ loadingProvinceData: true }))
            .postLoad(() => this.props.setState({ loadingProvinceData: false }))
            .success((response: ProvinceData[]) => {
                try {
                    schema.validate(response, 'array.provinceData');
                    this.props.setState({ provinceData: response });
                } catch (error) {
                    console.warn(error);
                }
            })
            .build();
        return provinceDataGetRequest;
    }
}
