import UserModel from '../models/UserModel';
import UserDTO from '../dto/UserDTO';
import AuthDTO from '../dto/AuthDTO';
import NoteModel from '../models/NoteModel';
import NoteDTO from '../dto/NoteDTO';

// export default class DTOMapper {
//     static transform<T, U>(data: Partial<U>, DTO: new () => T): T {
//         const dto = new DTO()
//         return Object.keys(dto).reduce((mappedData, key) => {
//             mappedData[key] = data[key]
//             return mappedData
//         }, {})
//     }
// }

class DTOMapper {
    toUserDTO = (obj: UserModel): UserDTO => {
        const dto = new UserDTO();
        let key: keyof UserDTO;

        for (key in dto)
            dto[key] = obj[key];

        return dto;
    };

    toAuthDTO = (obj: UserModel): AuthDTO => {
        const dto = new AuthDTO();
        let key: keyof AuthDTO;

        for (key in dto)
            dto[key] = obj[key];

        return dto;
    };

    toUser = (obj: UserModel, dto: UserDTO | AuthDTO): UserModel => {
        return Object.assign(obj, dto);
    };

    toNoteDTO = (obj: NoteModel) : NoteDTO => {
        const dto = new NoteDTO();
        let key: keyof NoteDTO;

        for (key in dto)
            dto[key] = obj[key];

        return dto;
    };

    toNote = (obj: NoteModel, dto: NoteDTO): NoteModel => {
        return Object.assign(obj, dto);
    }
}

export default new DTOMapper();