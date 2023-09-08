import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Jwt } from '../constants/jwt.constants';

@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context).getContext();
        if (!ctx.headers.authorization) {
            return false;
        }

        ctx.user = await this.validateToken(ctx.headers.authorization);

        return true;
    }

    private async validateToken(auth: string): Promise<string | object> {
        if (auth.split(' ')[0] !== 'Bearer') throw new HttpException(Jwt.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);

        const token = auth.split(' ')[1];

        try {
            return jwt.verify(token, process.env.SECRET);
        } catch (err) {
            throw new HttpException(Jwt.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
        }
    }
}
