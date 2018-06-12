import {
    RestRequest,
    FgRestBuilder,
} from '../../../../vendor/react-store/utils/rest';

import { RequestManager } from '../index';
import {
    Programme,
    SetProgrammesAction,
    SetRequestManagerLoadingAction,
} from '../../../../redux/interface';
import {
    urlForProgrammes,
    createParamsForProgrammes,
} from '../../../../rest';
import { Request } from '../../../../rest/interface';
import schema from '../../../../schema';

interface Props {
    setState: RequestManager['setState'];
    setProgrammes(params: SetProgrammesAction): void;
    setLoadings(params: SetRequestManagerLoadingAction): void;
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
            .preLoad(() => this.props.setLoadings({ loadingProgrammes: true }))
            .afterLoad(() => this.props.setLoadings({ loadingProgrammes: false }))
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
