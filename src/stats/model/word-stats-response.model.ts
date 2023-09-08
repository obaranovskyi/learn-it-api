import { ObjectType } from '@nestjs/graphql';

import { BaseResponseModel } from '../../shared/models/base-response.model';

@ObjectType()
export class WordStatsResponseModel extends BaseResponseModel {} // TODO: not sure this might be removed
