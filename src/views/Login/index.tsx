import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { reverseRoute } from '../../vendor/react-store/utils/common';
import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';
import NonFieldErrors from '../../vendor/react-store/components/Input/NonFieldErrors';
import TextInput from '../../vendor/react-store/components/Input/TextInput';
import PrimaryButton from '../../vendor/react-store/components/Action/Button/PrimaryButton';
import { RestRequest } from '../../vendor/react-store/utils/rest';
import Form, {
    emailCondition,
    lengthGreaterThanCondition,
    requiredCondition,
} from '../../vendor/react-store/components/Input/Form';

import {
    FormErrors,
    FormFieldErrors,
    ValuesFromForm,
    Schema,
} from '../../rest/interface';
import { startTasksAction } from '../../redux/middlewares/taskManager';
import {
    authenticateAction,
    loginAction,
} from '../../redux';
import { RootState, Token } from '../../redux/interface';
import { pathNames } from '../../constants';

import CreateTokenRequest from './requests/CreateTokenRequest';
import * as styles from './styles.scss';

interface OwnProps {}
interface PropsFromState { }
interface PropsFromDispatch {
    authenticate(): void;
    login(params: Token): void;
    startTasks(): void;
}
type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    formErrors: FormErrors;
    formFieldErrors: FormFieldErrors;
    formValues: ValuesFromForm;
    pending: boolean;
    pristine: boolean;
}

interface AuthParams {
    email: string;
    password: string;
}

export class Login extends React.PureComponent<Props, States> {
    userLoginRequest: RestRequest;
    schema: Schema;

    constructor(props: Props) {
        super(props);

        this.state = {
            formErrors: {},
            formFieldErrors: {},
            formValues: {},
            pending: false,
            pristine: false,
        };

        this.schema = {
            fields: {
                email: [
                    requiredCondition,
                    emailCondition,
                ],
                password: [
                    requiredCondition,
                    lengthGreaterThanCondition(4),
                ],
            },
        };
    }

    componentWillUnmount() {
        if (this.userLoginRequest) {
            this.userLoginRequest.stop();
        }
    }

    // FORM RELATED

    handleFormChange = (
        values: AuthParams, formFieldErrors: FormFieldErrors, formErrors: FormErrors,
    ) => {
        this.setState({
            formErrors,
            formFieldErrors,
            formValues: values,
            pristine: true,
        });
    }

    handleFormError = (formFieldErrors: FormFieldErrors, formErrors: FormErrors) => {
        this.setState({
            formErrors,
            formFieldErrors,
            pristine: true,
        });
    }

    handleFormSubmit = (value: AuthParams) => {
        if (this.userLoginRequest) {
            this.userLoginRequest.stop();
        }

        const request = new CreateTokenRequest({
            login: this.props.login,
            authenticate: this.props.authenticate,
            setState: v => this.setState(v),
            startTasks: this.props.startTasks,
        });
        this.userLoginRequest = request.create(value);
        this.userLoginRequest.start();
    }

    render() {
        const {
            formErrors,
            formFieldErrors,
            formValues,
            pending,
        } = this.state;

        return (
            <div className={styles.login}>
                <div className={styles.dfidContainer}>
                    <h1 className={styles.heading}>
                        DFID
                    </h1>
                </div>
                <div className={styles.loginFormContainer}>
                    <Form
                        className={styles.loginForm}
                        schema={this.schema}
                        value={formValues}
                        formErrors={formErrors}
                        fieldErrors={formFieldErrors}
                        changeCallback={this.handleFormChange}
                        successCallback={this.handleFormSubmit}
                        failureCallback={this.handleFormError}
                        disabled={pending}
                    >
                        {pending && <LoadingAnimation />}
                        <NonFieldErrors formerror="" />
                        <TextInput
                            formname="email"
                            label="Email"
                            placeholder="john.doe@mail.com"
                            autoFocus
                        />
                        <TextInput
                            formname="password"
                            label="Password"
                            placeholder="****"
                            type="password"
                        />
                        <div className={styles.actionButtons}>
                            <PrimaryButton type="submit">
                                Login
                            </PrimaryButton>
                        </div>
                    </Form>
                    <div className={styles.registerLinkContainer}>
                        <p>
                            No account yet ?
                        </p>
                        <Link
                            className={styles.registerLink}
                            to={reverseRoute(pathNames.register, {})}
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    authenticate: () => dispatch(authenticateAction()),
    login: (params: Token) => dispatch(loginAction(params)),
    startTasks: () => dispatch(startTasksAction()),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    undefined, mapDispatchToProps,
)(Login);
