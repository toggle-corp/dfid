import {
    ErrorsFromServer,
    ErrorsFromForm,
    FaramErrors,
} from './interface';

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

interface ServerError {
    [key: string]: string[];
}

// XXX: Uses Faram API
export const alterResponseErrorToFaramError = (errors: ServerError): FaramErrors => {
    const { nonFieldErrors = [], ...formFieldErrorList } = errors;

    return Object.keys(formFieldErrorList).reduce(
        (acc, key) => {
            acc[key] = formFieldErrorList[key].join(' ');
            return acc;
        },
        {
            $internal: nonFieldErrors,
        },
    );
};

// XXX: Uses Faram API
export const alterAndCombineResponseError = (errors: ServerError) => (
    Object.values(alterResponseErrorToFaramError(errors))
);

export * from './user';
export * from './province';
export * from './programmes';
export * from './sectors';
export * from './country';
export * from './indicator';
export * from './mapLayer';
