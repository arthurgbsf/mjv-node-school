import {Router} from 'express';
import productsRouter from './products.router';
import usersRouter from './users.router'

const router = Router();

router.use('/products', productsRouter);

router.use('/users', usersRouter);

export default router;