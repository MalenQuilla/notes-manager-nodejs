import jwt, {JwtPayload} from 'jsonwebtoken';
import ConfigParser from './ConfigParser';
import HTTPException from './HTTPException';
import StatusCodes, {ReasonPhrases} from 'http-status-codes';
import TokenType from '../const/TokenType';

class JwtUtil {
    generateJWT<T>(expiresIn: number, data: T, type: string): string {
        return jwt.sign({
            exp: Math.floor(Date.now() / 1000) + expiresIn,
            data: data,
            tokenType: type,
        }, ConfigParser.SECRET);
    };

    generateAccessToken<T>(data: T): string {
        return this.generateJWT<T>(ConfigParser.ACCESS_EXP, data, TokenType.ACCESS_TOKEN);
    };

    generateRefreshToken<T>(data: T): string {
        return this.generateJWT<T>(ConfigParser.REFRESH_EXP, data, TokenType.REFRESH_TOKEN);
    };

    getJWTPayload<T>(token: string): { data: T, type: string } {
        let payload!: JwtPayload;
        try {
            payload = jwt.verify(token, ConfigParser.SECRET) as JwtPayload;
        } catch (e) {
            console.log("JWT verification error: ", e);
            throw new HTTPException(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED);
        }
        return {data: payload.data as T, type: payload.tokenType};
    };

    isExpired(token: string): boolean {
        try {
            jwt.verify(token, ConfigParser.SECRET);
        } catch (e) {
            return true;
        }
        return false;
    };
}

export default new JwtUtil();