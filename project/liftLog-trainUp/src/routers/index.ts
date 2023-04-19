import {Router} from 'express';
import usersRouter from './users.router';
import workoutsRouter from './workouts.router';


const router = Router();

router.use('/users', usersRouter);

router.use('/workouts', workoutsRouter);

export default router;