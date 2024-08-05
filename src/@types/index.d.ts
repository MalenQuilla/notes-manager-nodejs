import UserModel from '../models/UserModel';

declare global {
    namespace Express {
        export interface Request {
            user?: UserModel;
        }
    }
}