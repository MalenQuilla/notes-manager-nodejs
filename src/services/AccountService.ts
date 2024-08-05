import UserModel from '../models/UserModel';
import UserService from './UserService';
import HTTPException from '../utils/HTTPException';
import StatusCodes, {ReasonPhrases} from 'http-status-codes';
import HTTPMessage from '../const/HTTPMessage';
import JwtUtil from '../utils/JwtUtil';
import UserStatus from '../const/UserStatus';
import RedisConfig from '../configs/RedisConfig';
import {v4 as uuidV4} from 'uuid';
import ActivationMail from '../const/ActivationMail';
import UserDTO from '../dto/UserDTO';
import DTOMapper from '../utils/DTOMapper';
import ConfigParser from '../utils/ConfigParser';
import MailerConfig from '../configs/MailerConfig';

class AccountService {
    signUp = async (payload: UserDTO): Promise<UserDTO> => {
        const user = await UserService.createUser(payload);

        if (!user)
            throw new HTTPException(StatusCodes.BAD_GATEWAY, HTTPMessage.USER_CREATE_FAILED);

        return DTOMapper.toUserDTO(user);
    };

    signIn = async (payload: UserModel): Promise<{ refresh: string, access: string }> => {
        const authDTO = DTOMapper.toAuthDTO(payload);
        const username = authDTO.username;
        const password = authDTO.password;

        if (!username || !password)
            throw new HTTPException(StatusCodes.UNAUTHORIZED, HTTPMessage.INCORRECT_USERNAME_OR_PASSWORD);

        const user = await UserModel.findOne({where: {username: username}});

        if (!user || !user.comparePassword(password))
            throw new HTTPException(StatusCodes.UNAUTHORIZED, HTTPMessage.INCORRECT_USERNAME_OR_PASSWORD);

        if (user.status === UserStatus.INACTIVE)
            throw new HTTPException(StatusCodes.BAD_GATEWAY, HTTPMessage.ACTIVATE_REQUIRED);

        const refreshToken = await this.getRefreshToken(user);
        const accessToken = JwtUtil.generateAccessToken(user.id);

        return {refresh: refreshToken, access: accessToken};
    };

    getRefreshToken = async (user: UserModel): Promise<string> => {
        if (!user.refreshToken || JwtUtil.isExpired(user.refreshToken)) {
            user.refreshToken = JwtUtil.generateRefreshToken(user.id);
            await user.save();
        }
        return user.refreshToken;
    };

    getNewAccessToken = async (refreshToken: string): Promise<string> => {
        const userId = JwtUtil.getJWTPayload<number>(refreshToken).data;

        return JwtUtil.generateAccessToken(userId);
    };

    requestActivation = async (domain: string, userID: number): Promise<void> => {
        const user = await UserModel.findOne(
            {where: {id: userID, status: UserStatus.INACTIVE}});
        if (!user)
            throw new HTTPException(StatusCodes.NOT_FOUND, HTTPMessage.ACC_404_OR_ALREADY_ACTIVATED);

        const redisClient = await RedisConfig.getClient();

        const key: string = `user-${userID}-act-code`;
        const activationCode: string = uuidV4();

        await redisClient.set(key, activationCode);
        await redisClient.expire(key, ConfigParser.KEY_EXP);
        const activationLink: string = `${domain}/api/v1/account/${userID}/${activationCode}`;

        const transporter = MailerConfig.getTransporter();
        transporter.sendMail(
            ActivationMail(user.lastname, user.email, user.username, activationLink),
            (error, info) => {
                error && console.error('NoteService: alarm: ', error);
                info && console.log('NoteService: alarm: ', info);
            });
    };

    activateAccount = async (userID: number, activationCode: string): Promise<void> => {
        const user = await UserModel.findOne(
            {where: {id: userID, status: UserStatus.INACTIVE}});

        if (!user)
            throw new HTTPException(StatusCodes.NOT_FOUND, HTTPMessage.ACC_404_OR_ALREADY_ACTIVATED);

        const redisClient = await RedisConfig.getClient();

        const realCode = await redisClient.get(`user-${userID}-act-code`);

        if (!realCode || !(activationCode === realCode))
            throw new HTTPException(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);

        user.status = UserStatus.ACTIVE;
        await user.save();
    };
}

export default new AccountService();