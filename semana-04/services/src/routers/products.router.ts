import {Router, Response, Request} from 'express';
import ProductsService from '../services/products.service';

const router = Router();

router.get("/", (req:Request, res:Response) => {
    const products = ProductsService.getAll();
    res.status(200).send(products);
});

router.get("/:id", (req:Request, res:Response) => {
    try {
        const product = ProductsService.getById(req.params.id);
        res.status(200).send(product);
    } catch (error:any) {
        res.status(400).send({message:error.message});
    }    
});

router.post("/", (req:Request, res:Response) => {
    ProductsService.create(req.body);
    res.status(200).send({message:'Produto adicionado com sucesso!'});
});

router.put("/:id", (req:Request, res:Response) => {
    try {
        ProductsService.update(req.params.id, req.body);
        res.status(200).send({message:'Produto alterado com sucesso!'});
    } catch (error:any) {
        res.status(400).send({message:error.message});
    }   
});

router.delete("/remove/:id", (req:Request, res:Response) => {
    try {
        ProductsService.remove(req.params.id);
        res.status(200).send({message:'Produto removido com sucesso!'});
    } catch (error:any) {
        res.status(400).send({message: error.message});
    }
});

export default router;