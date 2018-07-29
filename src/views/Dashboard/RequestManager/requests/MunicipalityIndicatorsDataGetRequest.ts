import {
    RestRequest,
    FgRestBuilder,
} from '../../../../vendor/react-store/utils/rest';

import { RequestManager } from '../index';
import {
    MunicipalityIndicatorData,
    SetMunicipalityIndicatorsDataAction,
    SetRequestManagerLoadingAction,
} from '../../../../redux/interface';
import {
    urlForMunicipalityIndicatorsData,
    createParamsForMunicipalityIndicatorsData,
} from '../../../../rest';
import { Request } from '../../../../rest/interface';
import schema from '../../../../schema';

interface Props {
    setState: RequestManager['setState'];
    setMunicipalityIndicatorsData(params: SetMunicipalityIndicatorsDataAction): void;
    setLoadings(params: SetRequestManagerLoadingAction): void;
}

export default class IndicatorsGetRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (response: MunicipalityIndicatorData[]) => {
        schema.validate(response, 'array.municipalityIndicatorsData');
        this.props.setMunicipalityIndicatorsData({ municipalityIndicatorsData: response });
    }

    create = (): RestRequest => {
        const request = new FgRestBuilder()
            .url(urlForMunicipalityIndicatorsData)
            .params(createParamsForMunicipalityIndicatorsData)
            .preLoad(() => this.props.setLoadings({ loadingIndicatorsData: true }))
            .afterLoad(() => this.props.setLoadings({ loadingIndicatorsData: false }))
            .success(this.success)
            .build();
        return request;
    }
}
