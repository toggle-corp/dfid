import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Landing } from '../index';
import {
    ProvinceInfo,
    SetProvincesInfoAction,
} from '../../../redux/interface';
import {
    urlForProvincesInfo,
    createParamsForProvincesInfo,
} from '../../../rest';
import { Request } from '../../../rest/interface';
import schema from '../../../schema';

interface Props {
    setState: Landing['setState'];
    setProvincesInfo(params: SetProvincesInfoAction): void;
}

export default class SectorsGetRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (response: ProvinceInfo[]) => {
        try {
            schema.validate(response, 'array.provinceInfo');
            this.props.setProvincesInfo({ provincesInfo: response });
        } catch (error) {
            console.warn(error);
        }
    }

    create = (): RestRequest => {
        const sectorsRequest = new FgRestBuilder()
            .url(urlForProvincesInfo)
            .params(createParamsForProvincesInfo)
            .preLoad(() => this.props.setState({ loadingProvincesInfo: true }))
            .afterLoad(() => this.props.setState({ loadingProvincesInfo: false }))
            .success(this.success)
            .build();
        return sectorsRequest;
    }
}
