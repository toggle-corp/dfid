import { ErrorsFromServer, ErrorsFromForm } from './interface';

export const transformResponseErrorToFormError = (errors: ErrorsFromServer): ErrorsFromForm => {
    const {
        nonFieldErrors = [],
        ...formFieldErrorList,
    }: {
        nonFieldErrors: string[];
    } = errors;
    const formErrors = {
        errors: nonFieldErrors,
    };

    const formFieldErrors = Object.keys(formFieldErrorList).reduce(
        (acc, key) => {
            acc[key] = formFieldErrorList[key].join(' ');
            return acc;
        },
        {},
    );
    return { formFieldErrors, formErrors };
};

export * from './token';
export * from './user';
