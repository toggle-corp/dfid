import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Landing } from '../index';
import {
    Municipality,
    SetMunicipalitiesAction,
} from '../../../redux/interface';
import {
    urlForMunicipalities,
    createParamsForMunicipalities,
} from '../../../rest';
import { Request } from '../../../rest/interface';
import schema from '../../../schema';

interface Props {
    setState: Landing['setState'];
    setMunicipalities(params: SetMunicipalitiesAction): void;
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
            .preLoad(() => this.props.setState({ loadingMunicipalities: true }))
            .afterLoad(() => this.props.setState({ loadingMunicipalities: false }))
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
