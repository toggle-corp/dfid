import { RestRequest } from '../vendor/react-store/utils/rest';
// FIXME: move form related parts outside

export interface RestPostBody {
    method: string;
    headers: object;
    body: string;
}

export interface RestGetBody {
    method: string;
    headers: object;
}

export interface RestHeader {
    Accept: string;
    'Content-Type': string;
    Authorization?: string;
}

export interface RestAuthorizationHeader {
    Authorization?: string;
}

export interface Request<T> {
    create: (value: T) => RestRequest;
}

export interface FormConditionFnRule {
    message: string;
    truth(value: any): boolean; // tslint:disable-line no-any
}

export interface FormConditionFnRules {
    [key: string]: FormConditionFnRule[];
}

export interface FormFieldErrors {
    [key: string]: string | undefined | FormFieldErrors;
}

export type FormErrors = {
    errors?: (string | undefined)[] | undefined,
    fields?: {
        [key: string]: (undefined | FormErrors);
    },
};

export interface ErrorsFromForm {
    formFieldErrors: FormFieldErrors;
    formErrors: FormErrors;
}

export interface ValuesFromForm {
    [key: string]: any; // tslint:disable-line no-any
}

export interface ErrorsFromServer {
    [key: string]: string[];
    nonFieldErrors: string[];
}

// tslint:disable-next-line no-any
type ConditionFn = (value: any) => { ok: boolean, message?: string };
type ConditionFns = ConditionFn[];
// tslint:disable-next-line no-any
type ValidationFn = (value: any) => string[];

interface ObjectSchema {
    validation?: ValidationFn;
    fields: {
        [key: string]: ObjectSchema | ConditionFns;
    };
}

interface ArraySchema {
    validation?: ValidationFn;
    members: ArraySchema | ObjectSchema | ConditionFns;
}

export type Schema = ArraySchema | ObjectSchema | ConditionFns;
