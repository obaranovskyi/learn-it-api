import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (value instanceof Object && this.isEmpty(value))
            throw new HttpException('Validation failed: no body submitted', HttpStatus.BAD_REQUEST);

        if (!metatype || !this.toValidate(metatype)) return value;

        const obj = plainToClass(metatype, value);
        const errors = await validate(obj);

        if (errors.length > 0)
            throw new HttpException(`Validation failed: ${this.formatErrors(errors)}`, HttpStatus.BAD_REQUEST);

        return value;
    }

    private toValidate(metatype: any): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find((type) => metatype === type);
    }

    private formatErrors(errors: any[]): string {
        return errors
            .map((error: any) => {
                for (const property in error.constraints) {
                    if (error.constraints) return error.constraints[property] || '';
                }
            })
            .join(', ');
    }

    private isEmpty(value: any) {
        return !Boolean(Object.keys(value).length > 0);
    }
}
