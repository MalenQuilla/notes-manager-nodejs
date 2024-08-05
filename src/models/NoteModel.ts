import {Column, DataType, Model, Table} from 'sequelize-typescript';
import DBConfig from '../configs/DBConfig';
import NoteStatus from '../const/NoteStatus';

@Table
class NoteModel extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: false,
    })
    title!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        unique: false,
    })
    description!: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        unique: false,
    })
    schedule!: Date;

    @Column({
        type: DataType.ENUM(...Object.values(NoteStatus)),
        defaultValue: NoteStatus.AVAILABLE,
    })
    status!: NoteStatus;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        unique: false,
    })
    userId!: number;
}

const sequelize = DBConfig.getSequelize();
sequelize.addModels([NoteModel]);

(async () => {
    await NoteModel.sync();
})();

export default NoteModel;