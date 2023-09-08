import { JwtUserModel } from '../../user/model/jwt-user.model';

export interface LoggerOptionsModel {
    user?: JwtUserModel;
    action: string;
    data?: any;
}
