import express from 'express';
import AuthHandler from '../middlewares/AuthHandler';
import NoteController from '../controllers/NoteController';

const noteRouter = express.Router();

noteRouter.post('/', AuthHandler.permitAllRoles, NoteController.createNote)
          .get('/', AuthHandler.permitUser, NoteController.findAllNotes)
          .put('/:id', AuthHandler.permitUser, NoteController.updateNote)
          .get('/:id', AuthHandler.permitUser, NoteController.findNote)
          .post('/:id', AuthHandler.permitUser, NoteController.restoreNote)
          .delete('/:id', AuthHandler.permitUser, NoteController.deleteNote);

export default noteRouter;