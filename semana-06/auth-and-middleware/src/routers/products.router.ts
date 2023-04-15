import {Router, Response, Request} from 'express';
import ProductsService from '../services/products.service';
import { authorizationMiddleware } from "../middlewares/authorization.middleware";

const router = Router();

router.get("/", authorizationMiddleware, async (req:Request, res:Response) => {
    try {
        const products = await ProductsService.getAll();
        res.status(200).send(products);
    } catch (error:any) {
        res.status(400).send({message:error.message});
    }
   
});

router.get("/:id", authorizationMiddleware, async (req:Request, res:Response) => {
    try {
        const product = await ProductsService.getById(req.params.id);
        res.status(200).send(product);
    } catch (error:any) {
        res.status(400).send({message:error.message});
    }    
});

router.post("/", authorizationMiddleware, async (req:Request, res:Response) => {
    await ProductsService.create(req.body);
    res.status(200).send({message:'Produto adicionado com sucesso!'});
});

router.put("/:id", authorizationMiddleware, async (req:Request, res:Response) => {
    try {
       await ProductsService.update(req.params.id, req.body);
        res.status(200).send({message:'Produto alterado com sucesso!'});
    } catch (error:any) {
        res.status(400).send({message:error.message});
    }   
});

router.delete("/remove/:id", authorizationMiddleware, async (req:Request, res:Response) => {
    try {
        await ProductsService.remove(req.params.id);
        res.status(200).send({message:'Produto removido com sucesso!'});
    } catch (error:any) {
        res.status(400).send({message: error.message});
    }
});

export default router;