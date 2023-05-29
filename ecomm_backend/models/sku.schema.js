import mongoose from 'mongoose';

const skuSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Please Enter A Product']
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: [true, 'Please Enter A Seller']
    },
    inventory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: [true, 'Please Enter An Inventory']
    },
    code: {
        type: String,
        trim: true,
        required: [true, 'Please Enter A Code']
    },
    price: {
        type: {
            mrp: {
                type: Number,
                required: [true, 'Please Enter An MRP']
            },
            current: {
                type: Number,
                required: [true, 'Please Enter A Current Price']
            },
            currency: {
                type: String,
                enum: ['INR', 'USD', 'EUR'],
                default: 'INR'
            }
        },
        required: [true, 'Please Enter Price Information']
    },
    taxRate: {
        type: Number,
        required: [true, "Tax rate is required"],
        min: [0, "Tax rate cannot be negative"],
        max: [100, "Tax rate cannot be greater than 100"],
        default: 0
    },
    description: {
        type: String,
        trim: true
    }
}, { timestamps: true });

export default mongoose.model('Sku', skuSchema);