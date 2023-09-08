import { AbstractValidator } from './abstract-validator';
import { ToSmallValidator } from './to-small-validator';
import { NoSpecialCharacterValidator } from './no-special-character-validator';
import { NoCharacterInUpperCaseValidator } from './no-character-in-upper-case-error-info.model';
import { NoNumberValidator } from './no-number-error-info.model';
import { ValidatorFactory } from './validator-factory';
import { NoCharacterInLowerCaseValidator } from './no-character-in-lower-case-validator';
import { PasswordErrorCodes } from './password-error-codes.enum';


export class PasswordValidatorFactory implements ValidatorFactory<PasswordErrorCodes> {
	create(validationType: PasswordErrorCodes): AbstractValidator<PasswordErrorCodes> {
		if(validationType === PasswordErrorCodes.NoCharacterInLowerCase)
			return new NoCharacterInLowerCaseValidator();
		if(validationType === PasswordErrorCodes.NoCharacterInUpperCase)
			return new NoCharacterInUpperCaseValidator();
		if(validationType === PasswordErrorCodes.NoNumber)
			return new NoNumberValidator();
		if(validationType === PasswordErrorCodes.NoSpecialCharacter)
			return new NoSpecialCharacterValidator();
		if(validationType === PasswordErrorCodes.ToSmall)
			return new ToSmallValidator();
	}
}
