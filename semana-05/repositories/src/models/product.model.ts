import mongoose, {Schema} from 'mongoose';

export const productSchema = new Schema({
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

export const Product = mongoose.model('Product', productSchema); 