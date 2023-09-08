import { AbstractValidator } from './abstract-validator';
import { NO_NUMBER_ERROR_MESSAGE } from './error-messages.constant';
import { PasswordErrorCodes } from './password-error-codes.enum';


export class NoNumberValidator extends AbstractValidator<PasswordErrorCodes> {
	constructor() {
		super(
			NO_NUMBER_ERROR_MESSAGE,
			PasswordErrorCodes.NoNumber
		);
	}

	valid(value: string): boolean {
		return /\d/.test(value);
	}
}
