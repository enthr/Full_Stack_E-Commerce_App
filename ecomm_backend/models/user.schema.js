import { promisify } from 'util';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import isEmail from 'validator/es/lib/isEmail';
import isMobilePhone from 'validator/es/lib/isMobilePhone';
import isURL from 'validator/es/lib/isURL';

import config from '../config/index.js';
import authRoles from '../utils/authRoles.js';

const generateJWTAync = promisify(jwt.sign);

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is Required'],
        maxLength: [50, 'First name cannot be more than 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is Required'],
        maxLength: [50, 'Last name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is Required'],
        unique: true,
        validate: {
            validator: function (value) {
                return isEmail(value);
            },
            message: 'Invalid Email'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is Required'],
        minLength: [8, 'Password cannot be less than 6 characters'],
        select: false
    },
    role: {
        type: String,
        enum: Object.values(authRoles),
        default: authRoles.USER
    },
    contact: {
        type: String,
        required: [true, 'Contact is Required'],
        validate: {
            validator: function (value) {
                return isMobilePhone(value, 'any');
            },
            message: 'Invalid Contact Number'
        }
    },
    profilePicture: {
        type: String,
        validate: {
            validator: function (value) {
                return isURL(value);
            },
            message: 'Invalid Profile Picture URL'
        }
    },
    addresses: [{
        type: Object,
        required: [true, 'Address is Required'],
        label: {
            type: String,
            required: [true, 'Label is Required']
        },
        street1: {
            type: String,
            required: [true, 'Street is Required']
        },
        street2: {
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
    }],
    status: {
        type: String,
        enum: ['UNVERIFIED', 'VERIFIED', 'BLOCKED'],
        default: 'UNVERIFIED'
    }
}, { timestamps: true });

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await argon2.hash(this.password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            hashLength: 50
        });
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods = {
    // Compare entered password with the password in the database
    comparePassword: async function (enteredPassword) {
        try {
            return await argon2.verify(this.password, enteredPassword);
        } catch (error) {
            throw error;
        }
    },

    // Generate JWT token
    gtJwtToken: async function () {
        try {
            return await generateJWTAync({
                id: this._id,
                name: this.fullName,
                email: this.email,
                role: this.role,
                status: this.status
            }, config.JWT_SECRET, {
                expiresIn: config.JWT_EXPIRY,
                algorithm: 'RS256'
            });
        } catch (error) {
            throw error;
        }
    }
}

export default mongoose.model('User', userSchema);