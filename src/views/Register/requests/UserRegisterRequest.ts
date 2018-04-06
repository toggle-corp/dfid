import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Register } from '../index';
import {
    createParamsForUserRegister,
    transformResponseErrorToFormError,
    urlForUsers,
} from '../../../rest';
import { ErrorsFromServer } from '../../../rest/interface';
import schema from '../../../schema';

// FIXME: Move this
interface Request<T> {
    create: (value: T) => RestRequest;
}

export interface RegisterParams {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
}

interface Props {
    setState: Register['setState'];
}

export default class UserRegisterRequest implements Request<RegisterParams> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    // REGISTER REST API
    create = ({ firstName, lastName, username, password }: RegisterParams): RestRequest => {
        const userLoginRequest = new FgRestBuilder()
            .url(urlForUsers)
            .params(createParamsForUserRegister({
                firstName,
                lastName,
                password,
                username,
            }))
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success((response: { access: string, refresh: string }) => {
                try {
                    schema.validate(response, 'userPostResponse');
                    this.props.setState({ success: true });
                } catch (err) {
                    console.error(err);
                }
            })
            .failure((response: { errors: ErrorsFromServer }) => {
                const {
                    formFieldErrors,
                    formErrors,
                } = transformResponseErrorToFormError(response.errors);
                this.props.setState({
                    formErrors,
                    formFieldErrors,
                    pending: false,
                });
            })
            .fatal(() => {
                this.props.setState({
                    formErrors: { errors: ['Some error occured.'] },
                    pending: false,
                });
            })
            .build();
        return userLoginRequest;
    }
}
