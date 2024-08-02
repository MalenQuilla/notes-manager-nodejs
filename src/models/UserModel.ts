import {AutoIncrement, Column, DataType, HasMany, IsEmail, Model, PrimaryKey, Table} from 'sequelize-typescript';
import UserStatus from '../const/UserStatus';
import sequelize from '../configs/DBConfig';
import UserRole from '../const/UserRole';
import bcrypt from 'bcrypt';
import config from '../utils/ConfigParser';
import NoteModel from './NoteModel';

@Table
class UserModel extends Model {

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    username!: string;

    @IsEmail
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    firstname!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    lastname!: string;

    @Column({
        type: DataType.ENUM(...Object.values(UserStatus)),
        defaultValue: UserStatus.INACTIVE,
    })
    status!: UserStatus;

    @Column({
        type: DataType.ENUM(...Object.values(UserRole)),
        defaultValue: UserRole.USER,
    })
    role!: UserRole;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    refreshToken?: string;

    @HasMany(() => NoteModel, {
        foreignKey: 'userId',
        sourceKey: 'id'
    })
    notes!: NoteModel[];

    comparePassword = (password: string) => {
        return bcrypt.compareSync(password, this.password);
    };
}

sequelize.addModels([UserModel]);

(async () => {
    await UserModel.sync();
})();

UserModel.beforeSave(function(instance, options) {
    if (instance.changed('password')) {
        instance.password = bcrypt.hashSync(instance.password, config.SALT);
    }
});

export default UserModel;