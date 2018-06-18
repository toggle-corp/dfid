import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Glossary } from '../index';
import {
    GlossaryData,
    SetGlossaryDataAction,
} from '../../../redux/interface';
import {
    urlForGlossaryData,
    createParamsForGlossaryData,
} from '../../../rest';
import { Request } from '../../../rest/interface';
import schema from '../../../schema';

interface Props {
    setState: Glossary['setState'];
    setGlossaryData(params: SetGlossaryDataAction): void;
}

export default class GlossaryGetRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (response: GlossaryData[]) => {
        try {
            schema.validate(response, 'array.glossaryData');
            this.props.setGlossaryData({ glossaryData: response });
        } catch (error) {
            console.warn(error);
        }
    }

    create = (): RestRequest => {
        const glossaryRequest = new FgRestBuilder()
            .url(urlForGlossaryData)
            .params(createParamsForGlossaryData)
            .preLoad(() => this.props.setState({ loadingGlossaryData: true }))
            .afterLoad(() => this.props.setState({ loadingGlossaryData: false }))
            .success(this.success)
            .build();
        return glossaryRequest;
    }
}
