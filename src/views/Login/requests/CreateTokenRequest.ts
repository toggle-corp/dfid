import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Login } from '../index';
import { Token } from '../../../redux/interface';
import {
    createParamsForTokenCreate,
    alterResponseErrorToFaramError,
    urlForTokenCreate,
} from '../../../rest';
import { ErrorsFromServer } from '../../../rest/interface';
import schema from '../../../schema';

// FIXME: Move this
interface Request<T> {
    create: (value: T) => RestRequest;
}

interface AuthParams {
    email: string;
    password: string;
}

interface Props {
    setState: Login['setState'];
    login(params: Token): void;
    authenticate(): void;
    startTasks(): void;
}

export default class CreateTokenRequest implements Request<AuthParams> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    // LOGIN REST API
    create = ({ email, password }: AuthParams): RestRequest => {
        const userLoginRequest = new FgRestBuilder()
            .url(urlForTokenCreate)
            .params(createParamsForTokenCreate({
                password,
                username: email,
            }))
            .preLoad(() => {
                this.props.setState({ pending: true, pristine: false });
            })
            .success((response: { token: string, refresh: string, userId: number }) => {
                try {
                    schema.validate(response, 'tokenGetResponse');
                    const { refresh, token: access, userId } = response;
                    this.props.login({ refresh, access, userId });
                    // TODO: call refresher here
                    this.props.setState({ pending: false });

                    this.props.startTasks();

                    this.props.authenticate();
                } catch (err) {
                    console.error(err);
                }
            })
            .failure((response: { errors: ErrorsFromServer }) => {
                const faramErrors = alterResponseErrorToFaramError(response.errors);
                this.props.setState({
                    faramErrors,
                    pending: false,
                });
            })
            .fatal(() => {
                this.props.setState({
                    faramErrors: { $internal: ['Some error occured.'] },
                    pending: false,
                });
            })
            .build();
        return userLoginRequest;
    }
}
