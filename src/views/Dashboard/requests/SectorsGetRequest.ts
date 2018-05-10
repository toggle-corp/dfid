import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Dashboard } from '../index';
import { Sector } from '../../../redux/interface';
import {
    urlForSectors,
    createParamsForSectors,
} from '../../../rest';
import { Request } from '../../../rest/interface';
import schema from '../../../schema';

interface Props {
    setState: Dashboard['setState'];
}

export default class SectorsGetRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (): RestRequest => {
        const sectorsRequest = new FgRestBuilder()
            .url(urlForSectors)
            .params(createParamsForSectors)
            .preLoad(() => this.props.setState({ loadingSectors: true }))
            .postLoad(() => this.props.setState({ loadingSectors: false }))
            .success((response: Sector[]) => {
                try {
                    schema.validate(response, 'array.sector');
                    this.props.setState({ sectors: response });
                } catch (error) {
                    console.warn(error);
                }
            })
            .build();
        return sectorsRequest;
    }
}
