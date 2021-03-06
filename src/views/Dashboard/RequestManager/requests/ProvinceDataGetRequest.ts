import {
    RestRequest,
    FgRestBuilder,
} from '../../../../vendor/react-store/utils/rest';

import { RequestManager } from '../index';
import {
    ProvinceData,
    SetProvincesDataAction,
    SetRequestManagerLoadingAction,
} from '../../../../redux/interface';
import {
    urlForProvinceData,
    createParamsForProvinceData,
} from '../../../../rest';
import { Request } from '../../../../rest/interface';
import schema from '../../../../schema';

interface Props {
    setState: RequestManager['setState'];
    setProvincesData(params: SetProvincesDataAction): void;
    setLoadings(params: SetRequestManagerLoadingAction): void;
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
            .preLoad(() => this.props.setLoadings({ loadingProvinceData: true }))
            .afterLoad(() => this.props.setLoadings({ loadingProvinceData: false }))
            .success((response: ProvinceData[]) => {
                try {
                    schema.validate(response, 'array.provinceData');
                    this.props.setProvincesData({ provincesData: response });
                } catch (error) {
                    console.warn(error);
                }
            })
            .build();
        return provinceDataGetRequest;
    }
}
