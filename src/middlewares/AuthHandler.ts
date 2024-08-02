import {NextFunction, Request, Response} from 'express';
import UserRole from '../const/UserRole';
import JwtUtil from '../utils/JwtUtil';
import HTTPException from '../utils/HTTPException';
import StatusCodes, {ReasonPhrases} from 'http-status-codes';
import UserModel from '../models/UserModel';
import UserStatus from '../const/UserStatus';
import TokenType from '../const/TokenType';

class AuthHandler {
    permit = (roles: UserRole[]) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            let accessToken = req.header('Authorization') || '';
            if (!accessToken.startsWith('Bearer '))
                throw new HTTPException(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED);

            const payload = JwtUtil.getJWTPayload<number>(accessToken.slice(7));

            const tokenType = payload.type;
            if (tokenType === TokenType.REFRESH_TOKEN)
                throw new HTTPException(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED);

            const userId = payload.data;
            const user = await UserModel.findOne({where: {id: userId, status: UserStatus.ACTIVE}});
            if (!user || !(roles.includes(user.role)))
                throw new HTTPException(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);

            res.locals.userId = userId;

            next();
        };
    };

    permitAdmin = this.permit([UserRole.ADMIN]);

    permitUser = this.permit([UserRole.USER]);

    permitAllRoles = this.permit(Object.values(UserRole));
}

export default new AuthHandler();