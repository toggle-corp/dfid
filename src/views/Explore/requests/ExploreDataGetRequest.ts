import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Explore } from '../index';
import {
    ExploreData,
    SetExploreDataAction,
} from '../../../redux/interface';
import {
    urlForExploreData,
    createParamsForExploreData,
} from '../../../rest';
import { Request } from '../../../rest/interface';
import schema from '../../../schema';

interface Props {
    setState: Explore['setState'];
    setExploreData(params: SetExploreDataAction): void;
}

export default class ExploreGetRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (response: ExploreData[]) => {
        try {
            schema.validate(response, 'array.exploreData');
            this.props.setExploreData({ exploreData: response });
        } catch (error) {
            console.warn(error);
        }
    }

    create = (): RestRequest => {
        const exploreRequest = new FgRestBuilder()
            .url(urlForExploreData)
            .params(createParamsForExploreData)
            .preLoad(() => this.props.setState({ loadingExploreData: true }))
            .afterLoad(() => this.props.setState({ loadingExploreData: false }))
            .success(this.success)
            .build();
        return exploreRequest;
    }
}
