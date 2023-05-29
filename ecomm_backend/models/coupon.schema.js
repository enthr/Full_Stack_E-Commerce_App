import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        trim: true,
        unique: true,
        uppercase: [true, 'Code must be uppercase'],
        required: [true, 'Code is required'],
        minlength: [5, 'Too short']
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        default: 'ACTIVE',
        enum: ['ACTIVE', 'INACTIVE']
    },
    discount: {
        type: {
            method: {
                type: String,
                enum: ['PERCENTAGE', 'FIXED']
            },
            value: {
                type: Number,
                required: [true, 'Value is required']
            },
            maxDiscount: {
                type: Number
            },
            minOrderValue: {
                type: Number
            }
        },
        required: [true, 'Discount is required'],
    },
    expiry: {
        type: Date,
        required: [true, 'Expiry is required']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller'
    }
}, { timestamps: true });

export default mongoose.model('Coupon', couponSchema);