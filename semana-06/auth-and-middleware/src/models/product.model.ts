import mongoose, {Schema} from 'mongoose';

export interface IProduct{
    description: string;
    img: string;
    price:number;
    quantity: number;
    createdAt: string | Date;

}

export const productSchema = new Schema<IProduct>({
    description:{
        type: String
    },
    img:{
        type: String
    },
    price:{
        type: Number
    },
    quantity:{
        type: Number
    },
    createdAt:{
        type: Date,
        default: new Date()
    }

});

export const Product = mongoose.model<IProduct>('Product', productSchema); 