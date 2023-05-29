import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
    label: {
        type: String,
        trim: true,
        required: [true, 'Please Enter A Label']
    },
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
    skus: {
        type: [{
            sku: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Sku',
                required: [true, 'Please Enter A Sku']
            },
            quantity: {
                type: Number,
                required: [true, 'Please Enter A Quantity'],
                default: 0
            }
        }]
    }
}, { timestamps: true });

export default mongoose.model('Inventory', inventorySchema);