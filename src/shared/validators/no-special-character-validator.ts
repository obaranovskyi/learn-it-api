import { AbstractValidator } from './abstract-validator';
import { NO_SPECIAL_CHARACTER_ERROR_MESSAGE } from './error-messages.constant';
import { PasswordErrorCodes } from './password-error-codes.enum';


export class NoSpecialCharacterValidator extends AbstractValidator<PasswordErrorCodes> {
	constructor() {
		super(
			NO_SPECIAL_CHARACTER_ERROR_MESSAGE,
			PasswordErrorCodes.NoSpecialCharacter
		);
	}

	valid(value: string): boolean {
		return /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
	}
}
