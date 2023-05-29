import mongoose from 'mongoose';
import isMobilePhone from 'validator/es/lib/isMobilePhone';
import isURL from 'validator/es/lib/isURL';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: [true, 'Seller is required']
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        required: [true, 'Payment is required']
    },
    currency: {
        type: String,
        enum: ['INR', 'USD', 'EUR'],
        default: 'INR'
    },
    items: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: [true, 'Product is required']
            },
            sku: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Inventory',
                required: [true, 'SKU is required']
            },
            quantity: {
                type: Number,
                required: [true, 'Quantity is required']
            },
            price: {
                type: Number,
                required: [true, 'Price is required']
            },
            discount: {
                type: Number,
                required: [true, 'Discount is required']
            },
            preTaxTotal: {
                type: Number,
                required: [true, 'Pre Tax Total is required']
            },
            tax: {
                type: Number,
                required: [true, 'Tax is required']
            },
            total: {
                type: Number,
                required: [true, 'Total is required']
            }
        }],
        required: [true, 'Items are required']
    },
    shipping: {
        type: {
            address: {
                name: {
                    type: String,
                    required: [true, 'Name is Required']
                },
                line1: {
                    type: String,
                    required: [true, 'Street is Required']
                },
                line2: {
                    type: String
                },
                city: {
                    type: String,
                    required: [true, 'City is Required']
                },
                state: {
                    type: String,
                    required: [true, 'State is Required']
                },
                country: {
                    type: String,
                    required: [true, 'Country is Required']
                },
                pincode: {
                    type: String,
                    required: [true, 'Pincode is Required']
                },
                phone: {
                    type: String,
                    required: [true, 'Phone is Required'],
                    validate: {
                        validator: function (v) {
                            return isMobilePhone(v, 'any', { strictMode: true });
                        }
                    }
                }
            },
            origin: {
                name: {
                    type: String,
                    required: [true, 'Name is Required']
                },
                line1: {
                    type: String,
                    required: [true, 'Street is Required']
                },
                line2: {
                    type: String
                },
                city: {
                    type: String,
                    required: [true, 'City is Required']
                },
                state: {
                    type: String,
                    required: [true, 'State is Required']
                },
                country: {
                    type: String,
                    required: [true, 'Country is Required']
                },
                pincode: {
                    type: String,
                    required: [true, 'Pincode is Required']
                },
                phone: {
                    type: String,
                    required: [true, 'Phone is Required'],
                    validate: {
                        validator: (value) => {
                            return isMobilePhone(value, 'any', { strictMode: true });
                        }
                    }
                }
            },
            carrier: {
                type: [{
                    name: {
                        type: String,
                        required: [true, 'Name is Required']
                    },
                    code: {
                        type: String,
                        required: [true, 'Code is Required']
                    },
                    tracking: {
                        type: String,
                        required: [true, 'Tracking is Required'],
                        validate: {
                            validator: (value) => {
                                return isURL(value);
                            }
                        }
                    }
                }],
                required: [true, 'Carrier is required']
            }
        },
        required: [true, 'Shipping Info is required']
    }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);