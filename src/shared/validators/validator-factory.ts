import { AbstractValidator } from './abstract-validator';

export interface ValidatorFactory<EV> {
	create(validationType: EV): AbstractValidator<EV>;
}
