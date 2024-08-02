import express from 'express';
import userRouter from './UserRoute';
import accountRouter from './AccountRoute';
import noteRouter from './NoteRoute';

const router = express.Router();

const routes = [
    {
        path: '/user',
        route: userRouter,
    },
    {
        path: '/account',
        route: accountRouter,
    },
    {
        path: '/note',
        route: noteRouter,
    }
];

routes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;