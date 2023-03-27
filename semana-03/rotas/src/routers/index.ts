import {Router} from 'express';
import productsRouter from './products.router';

const router = Router();

router.use('/products', productsRouter);

export default router;