import UserModel from '../models/UserModel';
import HTTPException from '../utils/HTTPException';
import StatusCodes from 'http-status-codes';
import DTOMapper from '../utils/DTOMapper';
import HTTPMessage from '../const/HTTPMessage';
import UserStatus from '../const/UserStatus';
import UserDTO from '../dto/UserDTO';

class UserService {
    findAllUsers = async (offset: number = 0, limit: number = 50) => {
        return UserModel.findAll({
            attributes: ['id', 'firstname', 'lastname', 'email', 'status', 'role'],
            offset: offset,
            limit: limit,
        });
    };

    findOneUser = async (id: number) => {
        const user = await UserModel.findOne({
            where: {id: id},
            attributes: ['id', 'firstname', 'lastname', 'email', 'status', 'role'],
        });

        if (!user)
            throw new HTTPException(StatusCodes.NOT_FOUND, HTTPMessage.USER_404);
        return user;
    };

    createUser = async (payload: UserDTO) => {
        return UserModel.create({...payload});
    };

    updateUser = async (id: number, payload: UserDTO) => {
        let user = await UserModel.findOne({
            where: {id: id},
        });

        if (!user)
            throw new HTTPException(StatusCodes.NOT_FOUND, HTTPMessage.USER_404);

        user = DTOMapper.toUser(user, payload);

        const newUser = await user.save();
        return DTOMapper.toUserDTO(newUser);
    };

    deleteUser = async (id: number): Promise<void> => {
        const user = await UserModel.findOne({
            where: {id: id, status: UserStatus.ACTIVE},
        });

        if (!user)
            throw new HTTPException(StatusCodes.NOT_FOUND, HTTPMessage.USER_404);

        user.status = UserStatus.INACTIVE;
        await user.save();
    };

    activateUser = async (id: number): Promise<void> => {
        const user = await UserModel.findOne({
            where: {id: id, status: UserStatus.INACTIVE},
        });

        if (!user)
            throw new HTTPException(StatusCodes.NOT_FOUND, HTTPMessage.USER_404);

        user.status = UserStatus.ACTIVE;
        await user.save();
    };

    restrictUser = async (id: number): Promise<void> => {
        const user = await UserModel.findOne({
            where: {id: id},
        });

        if (!user)
            throw new HTTPException(StatusCodes.NOT_FOUND, HTTPMessage.USER_404);

        user.status = UserStatus.RESTRICTED;
        await user.save();
    };
}

export default new UserService();