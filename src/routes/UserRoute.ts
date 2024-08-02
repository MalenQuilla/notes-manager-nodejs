import express from 'express';
import UserController from '../controllers/UserController';
import AuthHandler from '../middlewares/AuthHandler';
import ValidationHandler from '../middlewares/ValidationHandler';
import UserValidation from '../validations/UserValidation';

const userRouter = express.Router();

userRouter.post('/', AuthHandler.permitAdmin,
              ValidationHandler.validate(UserValidation.createUser, 'body'),
              UserController.createUser)

          .get('/', AuthHandler.permitAdmin,
              UserController.findAllUsers)

          .get('/:id', AuthHandler.permitAdmin,
              UserController.findUser)

          .put('/:id', AuthHandler.permitAdmin,
              ValidationHandler.validate(UserValidation.updateUser, 'body'),
              UserController.updateUser)

          .delete('/:id', AuthHandler.permitAdmin,
              UserController.deleteUser)

          .post('/:id', AuthHandler.permitAdmin,
              UserController.activeUser)

          .delete('/:id/restrict', AuthHandler.permitAdmin,
              UserController.restrictUser);

export default userRouter;