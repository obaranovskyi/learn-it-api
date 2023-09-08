import { AbstractValidator } from './abstract-validator';
import { ValidationErrorInfo } from './validation-error-info.model';
import { ValidatorFactory } from './validator-factory';

export class Validation<EV> {
	private _errors: ValidationErrorInfo<EV>[];

	constructor(private _factory: ValidatorFactory<EV>,
				private _validationTypes: EV[]) {}

	protected errors(value: string): ValidationErrorInfo<EV>[] {
		if(this._errors) return this._errors;

		this._errors = this._validationTypes.reduce((acc, validationType: EV) => {
			const validator: AbstractValidator<EV> = this._factory.create(validationType);

			if(validator.invalid(value))
				acc.push(validator.info());

			return acc;
		}, []);

		return this._errors;
	}
}
