import { ValidationErrorInfo } from './validation-error-info.model';

export abstract class AbstractValidator<EV> {

	constructor(public message: string,
				public code: EV) {}

	abstract valid(value: string): boolean;

	invalid(value: string): boolean {
		return !this.valid(value);
	}

	info(): ValidationErrorInfo<EV> {
		return { message: this.message, code: this.code }
	}
}
