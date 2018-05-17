import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Register } from '../index';
import {
    createParamsForUserRegister,
    alterResponseErrorToFaramError,
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
    email: string;
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

    success = (response: { access: string, refresh: string }) => {
        try {
            schema.validate(response, 'userPostResponse');
            this.props.setState({ success: true });
        } catch (err) {
            console.error(err);
        }
    }

    failure = (response: { errors: ErrorsFromServer }) => {
        try {
            const faramErrors = alterResponseErrorToFaramError(response.errors);
            this.props.setState({
                faramErrors,
                pending: false,
            });
        } catch {
            this.fatal();
        }
    }

    fatal = () => {
        this.props.setState({
            faramErrors: { $internal: ['Some error occured.'] },
            pending: false,
        });
    }

    // REGISTER REST API
    create = ({ firstName, lastName, email, password }: RegisterParams): RestRequest => {
        const userLoginRequest = new FgRestBuilder()
            .url(urlForUsers)
            .params(createParamsForUserRegister({
                firstName,
                lastName,
                password,
                email,
            }))
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success(this.success)
            .failure(this.failure)
            .fatal(this.fatal)
            .build();
        return userLoginRequest;
    }
}
