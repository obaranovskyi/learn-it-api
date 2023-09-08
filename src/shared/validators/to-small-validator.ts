import { AbstractValidator } from './abstract-validator';
import { TO_SMALL_ERROR_MESSAGE } from './error-messages.constant';
import { PasswordErrorCodes } from './password-error-codes.enum';


export class ToSmallValidator extends AbstractValidator<PasswordErrorCodes> {
	constructor() {
		super(
			TO_SMALL_ERROR_MESSAGE,
			PasswordErrorCodes.ToSmall
		);
	}

	valid(value: string): boolean {
		return value.length >= 10;
	}
}
