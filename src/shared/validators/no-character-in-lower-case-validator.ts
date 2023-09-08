import { AbstractValidator } from './abstract-validator';
import { NO_CHARACTER_IN_LOWER_CASE_ERROR_MESSAGE } from './error-messages.constant';
import { PasswordErrorCodes } from './password-error-codes.enum';


export class NoCharacterInLowerCaseValidator extends AbstractValidator<PasswordErrorCodes> {
	constructor() {
		super(
			NO_CHARACTER_IN_LOWER_CASE_ERROR_MESSAGE,
			PasswordErrorCodes.NoCharacterInLowerCase
		);
	}

	valid(value: string): boolean {
		return /[a-z]/.test(value);
	}
}
