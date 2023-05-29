import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: [true, 'Order is required']
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: [true, 'Seller is required']
    },
    provider: {
        type: String,
        enum: ['STRIPE', 'RAZORPAY'],
        default: 'STRIPE'
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required']
    },
    status: {
        type: String,
        enum: ['PENDING', 'SUCCESS', 'FAILED'],
        default: 'PENDING'
    },
    token: {
        type: String,
        required: [true, 'Token is required']
    },
    transactionId: {
        type: String
    },
    paymentResponse: {
        type: Object
    }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);