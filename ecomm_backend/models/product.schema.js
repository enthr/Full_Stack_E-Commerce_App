import mongoose from 'mongoose';
import isURL from 'validator/es/lib/isURL';
import isEmail from 'validator/es/lib/isEmail';
import isMobilePhone from 'validator/es/lib/isMobilePhone';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Name is required']
    },
    code: {
        type: String,
        trim: true,
        required: [true, 'Code is required']
    },
    assets: [{
        type: String,
        trim: true,
        required: [true, 'Asset is required'],
        validate: {
            validator: (value) => {
                return isURL(value);
            },
            message: 'Asset must be a valid URL'
        }
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
        required: [true, 'Sub-Category is required']
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: [true, 'Seller is required']
    },
    inventory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: [true, 'Inventory is required']
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'Description is required']
    },
    demensions: {
        type: {
            height: {
                type: Number,
                required: [true, 'Height is required']
            },
            width: {
                type: Number,
                required: [true, 'Width is required']
            },
            length: {
                type: Number,
                required: [true, 'Length is required']
            },
            unit: {
                type: String,
                trim: true,
                required: [true, 'Unit is required']
            }
        },
        required: [true, 'Demensions are required']
    },
    details: {
        type: {
            brandDetails: {
                type: String,
                trim: true,
                required: [true, 'Brand Name is required']
            },
            manufacturerDetails: {
                type: String,
                trim: true,
                required: [true, 'Manufacturer Name is required']
            },
            packerDetails: {
                type: String,
                trim: true,
                required: [true, 'Packer Name is required']
            },
            importerDetails: {
                type: String,
                trim: true,
                required: [true, 'Importer Name is required']
            },
            countryOfOrigin: {
                type: String,
                trim: true,
                required: [true, 'Country of Origin is required']
            },
            phoneNumber: {
                type: String,
                trim: true,
                required: [true, 'Phone Number is required'],
                validate: {
                    validator: (value) => {
                        return isMobilePhone(value, 'any', { strictMode: true });
                    },
                    message: 'Phone Number must be a valid phone number'
                }
            },
            email: {
                type: String,
                trim: true,
                required: [true, 'Email is required'],
                validate: {
                    validator: (value) => {
                        return isEmail(value);
                    },
                    message: 'Email must be a valid email address'
                }
            }
        }
    },
    reviews: [{
        rating: {
            type: Number,
            min: 0,
            max: 5,
            required: [true, 'Rating is required']
        },
        comment: {
            type: String,
            trim: true,
            required: [true, 'Comment is required']
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: ['INACTIVE', 'ACTIVE', 'BLOCKED'],
        default: 'ACTIVE'
    }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);