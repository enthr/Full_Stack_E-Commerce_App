import mongoose from 'mongoose';
import isURL from 'validator/es/lib/isURL';
import isEmail from 'validator/es/lib/isEmail';
import isMobilePhone from 'validator/es/lib/isMobilePhone';

const sellerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is Required']
    },
    name: {
        type: String,
        required: [true, 'Name is Required']
    },
    email: {
        type: String,
        required: [true, 'Email is Required'],
        validate: {
            validator: (value) => {
                return isEmail(value);
            },
            message: 'Invalid Email'
        }
    },
    contact: {
        type: String,
        required: [true, 'Contact is Required'],
        validate: {
            validator: (value) => {
                return isMobilePhone(value, 'any', { strictMode: true });
            }
        }            
    },
    businessDetails: {
        type: {
            name: {
                type: String,
                required: [true, 'Business Name is Required']
            },
            type: {
                type: String,
                required: [true, 'Business Type is Required']
            },
            registrationNumber: {
                type: String,
                required: [true, 'Registration Number is Required']
            },
            panNumber: {
                type: String,
                required: [true, 'PAN Number is Required']
            },
            gstin: {
                type: String,
                required: [true, 'GSTIN is Required']
            },
            permitsAndLicenses: [{
                type: {
                    name: {
                        type: String,
                        required: [true, 'Name is Required']
                    },
                    document: {
                        type: String,
                        required: [true, 'Document is Required'],
                        validate: {
                            validator: (value) => {
                                return isURL(value);
                            },
                            message: 'Invalid URL'
                        }
                    }
                },
            }],
            address: {
                type: {
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
                    }
                },
                required: [true, 'Business Address is Required']
            }
        },
        required: [true, 'Business Details are Required']
    },
    bankDetails: {
        type: {
            accountNumber: {
                type: String,
                required: [true, 'Account Number is Required']
            },
            accountHolderName: {
                type: String,
                required: [true, 'Account Holder Name is Required']
            },
            ifscCode: {
                type: String,
                required: [true, 'IFSC Code is Required']
            },
            name: {
                type: String,
                required: [true, 'Bank Name is Required']
            },
            branch: {
                type: String,
                required: [true, 'Branch Name is Required']
            },
            pincode: {
                type: String,
                required: [true, 'Pincode is Required']
            },
            upi: {
                type: {
                    id: {
                        type: String,
                        required: [true, 'UPI ID is Required']
                    },
                    name: {
                        type: String,
                        required: [true, 'UPI Name is Required']
                    }
                },
                required: [true, 'UPI is Required']
            }
        },
        required: [true, 'Bank Details is Required']
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'BLOCKED', 'INACTIVE'],
        default: 'PENDING'
    },
    description: {
        type: String
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    inventories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory'
    }],
    coupons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon'
    }]
}, { timestamps: true });

// Seller Rating Virtual
sellerSchema.virtual("rating").get(function () {
    if (this.orders.length === 0) return 0;
    let totalRating = 0;
    this.orders.map(order => {
        totalRating += order.review.rating;
    });
    return totalRating / this.orders.length;
});

export default mongoose.model('Seller', sellerSchema);