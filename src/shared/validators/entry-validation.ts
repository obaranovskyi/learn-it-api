import { ValidationErrorInfo } from './validation-error-info.model';

export interface EntryValidation<EV> {
	satisfy(): boolean;
	unsatisfied(): ValidationErrorInfo<EV>[];
}
