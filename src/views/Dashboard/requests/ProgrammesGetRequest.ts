import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Dashboard } from '../index';
import {
    Programme,
    SetProgrammesAction,
} from '../../../redux/interface';
import {
    urlForProgrammes,
    createParamsForProgrammes,
} from '../../../rest';
import { Request } from '../../../rest/interface';
import schema from '../../../schema';

interface Props {
    setState: Dashboard['setState'];
    setProgrammes(params: SetProgrammesAction): void;
}

export default class ProgrammesGetRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (): RestRequest => {
        const programmeRequest = new FgRestBuilder()
            .url(urlForProgrammes)
            .params(createParamsForProgrammes)
            .preLoad(() => this.props.setState({ loadingProgrammes: true }))
            .postLoad(() => this.props.setState({ loadingProgrammes: false }))
            .success((response: Programme[]) => {
                try {
                    schema.validate(response, 'array.programme');
                    this.props.setProgrammes({ programmes: response });
                } catch (error) {
                    console.warn(error);
                }
            })
            .build();
        return programmeRequest;
    }
}
