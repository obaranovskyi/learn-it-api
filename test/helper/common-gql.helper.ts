import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

import { GqlResponseModel } from '../models/gql-response.model';
import { API_PATH } from '../constants';
import { Validation } from '../../src/shared/constants/validation.constants';

export function toException(gqlError: GqlResponseModel): any {
    return gqlError.body.errors[0].extensions.exception;
}

export function gqlRequest(token?: string): request.Test {
    const gqlPost = request(API_PATH).post('graphql');

    return token ? gqlPost.set('Authorization', `Bearer ${token}`) : gqlPost;
}

export function cannotBeDone(res: GqlResponseModel, responseMessage: string = Validation.UNAUTHORIZED): void {
    const { status, response } = toException(res);

    expect(res.body.data).toBeNull();
    expect(status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response).toBe(responseMessage);
}
