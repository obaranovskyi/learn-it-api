import { registerEnumType } from '@nestjs/graphql';

export enum PeriodTypeEnum {
    DAY = 'DAY',
    MONTH = 'MONTH',
    YEAR = 'YEAR',
}

registerEnumType(PeriodTypeEnum, { name: 'PeriodTypeEnum' });
