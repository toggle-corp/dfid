import {
    RestRequest,
    FgRestBuilder,
} from '../../../../vendor/react-store/utils/rest';

import { RequestManager } from '../index';
import {
    Municipality,
    SetMunicipalitiesAction,
    SetRequestManagerLoadingAction,
} from '../../../../redux/interface';
import {
    urlForMunicipalities,
    createParamsForMunicipalities,
} from '../../../../rest';
import { Request } from '../../../../rest/interface';
import schema from '../../../../schema';

interface Props {
    setState: RequestManager['setState'];
    setMunicipalities(params: SetMunicipalitiesAction): void;
    setLoadings(params: SetRequestManagerLoadingAction): void;
}

export default class ProvinceDataGetRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (): RestRequest => {
        const request = new FgRestBuilder()
            .url(urlForMunicipalities)
            .params(createParamsForMunicipalities)
            .preLoad(() => this.props.setLoadings({ loadingMunicipalities: true }))
            .afterLoad(() => this.props.setLoadings({ loadingMunicipalities: false }))
            .success((response: Municipality[]) => {
                try {
                    schema.validate(response, 'array.municipality');
                    this.props.setMunicipalities({ municipalities: response });
                } catch (error) {
                    console.warn(error);
                }
            })
            .build();
        return request;
    }
}
