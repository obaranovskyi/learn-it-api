import { AbstractValidator } from './abstract-validator';
import { NO_CHARACTER_IN_UPPER_CASE_ERROR_MESSAGE } from './error-messages.constant';
import { PasswordErrorCodes } from './password-error-codes.enum';


export class NoCharacterInUpperCaseValidator extends AbstractValidator<PasswordErrorCodes> {
	constructor() {
		super(
			NO_CHARACTER_IN_UPPER_CASE_ERROR_MESSAGE,
			PasswordErrorCodes.NoCharacterInUpperCase
		);
	}

	valid(value: string): boolean {
		return /[A-Z]/.test(value);
	}
}
