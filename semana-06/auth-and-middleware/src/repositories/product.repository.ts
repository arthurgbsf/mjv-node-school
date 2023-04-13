import { Product, IProduct } from "../models/product.model";


class ProductRepository{

    getAll(){
        return Product.find();
    };

    getById(id:string){
        return Product.findOne({_id:id});
    };

    create(product:IProduct){
        return Product.create(product);
    };

    update(id:string, product: Partial<IProduct>){
        return Product.updateOne({_id:id}, {$set:product});
    }

    remove(id:string){
        return Product.deleteOne({_id:id});
    };
};


export default new ProductRepository;