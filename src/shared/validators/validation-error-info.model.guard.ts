import { ValidationErrorInfo } from './validation-error-info.model';

/* Might be removed if it won't be used */
export const isPasswordErrorInfo = <EV>(
    maybePasswordErrorInfo: any
): maybePasswordErrorInfo is ValidationErrorInfo<EV> => {
    return maybePasswordErrorInfo && maybePasswordErrorInfo.message && maybePasswordErrorInfo.code;
};
