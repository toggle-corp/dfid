import React from 'react';
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
import { pathNames } from '../../constants';

import UserRegisterRequest, { RegisterParams } from './requests/UserRegisterRequest';
import * as styles from './styles.scss';

interface OwnProps {}
interface PropsFromState { }

type Props = OwnProps & PropsFromState;

interface States {
    formErrors: FormErrors;
    formFieldErrors: FormFieldErrors;
    formValues: ValuesFromForm;
    pending: boolean;
    pristine: boolean;
    success: boolean;
}

export class Register extends React.PureComponent<Props, States> {
    userRegisterRequest: RestRequest;
    schema: Schema;

    constructor(props: Props) {
        super(props);

        this.state = {
            formErrors: {},
            formFieldErrors: {},
            formValues: {},
            pending: false,
            pristine: false,
            success: false,
        };

        this.schema = {
            fields: {
                firstName: [requiredCondition],
                lastName: [requiredCondition],
                username: [
                    requiredCondition,
                    emailCondition,
                ],
                password: [
                    requiredCondition,
                    lengthGreaterThanCondition(4),
                ],
                confirmPassword: [
                    requiredCondition,
                    lengthGreaterThanCondition(4),
                ],
            },
            validation: ({ password, confirmPassword }) => {
                const errors = [];
                if (password !== confirmPassword) {
                    errors.push('Passwords do not match');
                }
                return errors;
            },
        };
    }

    componentWillUnmount() {
        if (this.userRegisterRequest) {
            this.userRegisterRequest.stop();
        }
    }

    // FORM RELATED

    handleFormChange = (
        values: RegisterParams, formFieldErrors: FormFieldErrors, formErrors: FormErrors,
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

    handleFormSubmit = (value: RegisterParams) => {
        if (this.userRegisterRequest) {
            this.userRegisterRequest.stop();
        }
        const userRegisterRequest = new UserRegisterRequest({
            setState: v => this.setState(v),
        });
        this.userRegisterRequest = userRegisterRequest.create(value);
        this.userRegisterRequest.start();
    }

    render() {
        const {
            formErrors,
            formFieldErrors,
            formValues,
            pending,
            success,
        } = this.state;

        return (
            <div className={styles.register}>
                <div className={styles.dfidContainer}>
                    <h1 className={styles.heading}>
                        DFID
                    </h1>
                </div>
                <div className={styles.registerFormContainer}>
                    {
                        success ? (
                            <div className={styles.registerSuccess}>
                                <p>
                                    User is registered successfully.
                                    Please login to continue.
                                </p>
                            </div>
                        ) : (
                            <Form
                                className={styles.registerForm}
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
                                    formname="firstName"
                                    label="First Name"
                                    placeholder="John"
                                    autoFocus
                                />
                                <TextInput
                                    formname="lastName"
                                    label="Last Name"
                                    placeholder="Doe"
                                />
                                <TextInput
                                    formname="username"
                                    label="Email"
                                    placeholder="john.doe@mail.com"
                                />
                                <TextInput
                                    formname="password"
                                    label="Password"
                                    placeholder="****"
                                    type="password"
                                />
                                <TextInput
                                    formname="confirmPassword"
                                    label="Confirm Password"
                                    placeholder="****"
                                    type="password"
                                />
                                <div className={styles.actionButtons}>
                                    <PrimaryButton type="submit">
                                        Register
                                    </PrimaryButton>
                                </div>
                            </Form>
                        )
                    }
                    <div className={styles.loginLinkContainer}>
                        <p>
                            Already have a account ?
                        </p>
                        <Link
                            className={styles.loginLink}
                            to={reverseRoute(pathNames.login, {})}
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect<PropsFromState>(undefined)(Register);
