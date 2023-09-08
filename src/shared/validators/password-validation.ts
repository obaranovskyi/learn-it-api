import { PasswordErrorCodes } from './password-error-codes.enum';
import { Validation } from './validation';
import { PasswordValidatorFactory } from './password-validator-factory';
import { ValidationErrorInfo } from './validation-error-info.model';
import { EntryValidation } from './entry-validation';


export class PasswordValidation extends Validation<PasswordErrorCodes> implements EntryValidation<PasswordErrorCodes> {
	constructor(private _value: string) {
		super(new PasswordValidatorFactory(), PasswordErrorCodes.values());
	}

	satisfy(): boolean {
		return super.errors(this._value).length === 0;
	}

	unsatisfied(): ValidationErrorInfo<PasswordErrorCodes>[] {
		return super.errors(this._value);
	}
}
