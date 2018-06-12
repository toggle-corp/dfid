import {
    RestRequest,
    FgRestBuilder,
} from '../../../../vendor/react-store/utils/rest';

import { RequestManager } from '../index';
import {
    ProgrammeData,
    SetProgrammesDataAction,
    SetRequestManagerLoadingAction,
} from '../../../../redux/interface';
import {
    urlForProgrammeData,
    createParamsForProgrammeData,
} from '../../../../rest';
import { Request } from '../../../../rest/interface';
import schema from '../../../../schema';

interface Props {
    setState: RequestManager['setState'];
    setProgrammesData(params: SetProgrammesDataAction): void;
    setLoadings(params: SetRequestManagerLoadingAction): void;
}

export default class ProgrammesDataRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (): RestRequest => {
        const programmeDataRequest = new FgRestBuilder()
            .url(urlForProgrammeData)
            .params(createParamsForProgrammeData)
            .preLoad(() => this.props.setLoadings({ loadingProgrammeData: true }))
            .afterLoad(() => this.props.setLoadings({ loadingProgrammeData: false }))
            .success((response: ProgrammeData[]) => {
                try {
                    schema.validate(response, 'array.programmeData');
                    this.props.setProgrammesData({ programmesData: response });
                } catch (error) {
                    console.warn(error);
                }
            })
            .build();
        return programmeDataRequest;
    }
}
