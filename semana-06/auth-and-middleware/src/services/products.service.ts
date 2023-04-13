import { IProduct } from "../models/product.model";
import ProductRepository from "../repositories/product.repository";
import {UpdateWriteOpResult} from 'mongoose';
import {DeleteResult} from 'mongodb';


class ProductsService{

    async getAll (){
        const products = await ProductRepository.getAll();
        if(products.length === 0){
            throw new Error("Não existe nenhum produto cadastrado");
        }
        return products;
    }

    async getById (id:string) {
        const product = await ProductRepository.getById(id);
        if(product === null){
            throw new Error('Produto não encontrado.');
        }
        return product;
    }

    create (product:IProduct) {
        return ProductRepository.create(product);
        
    }

    async update (id:string, product:IProduct) {
        const result:UpdateWriteOpResult = await ProductRepository.update(id,product);
        if(result.matchedCount === 0){
            throw new Error('Produto não encontrado');
        }
    }

    async remove(id:string){
        const result: DeleteResult = await ProductRepository.remove(id);
        if(result.deletedCount === 0){
            throw new Error('Produto não encontrado');
        }
    }
    
}

export default  new ProductsService;