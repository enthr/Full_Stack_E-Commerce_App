import { promisify } from 'util';
import { randomBytes } from 'crypto';
import mongoose from 'mongoose';
import * as argon2 from 'argon2';

import config from '../config/index.js';

const generateRandomBytesAsync = promisify(randomBytes);

const tokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is Required']
    },
    token: {
        type: String,
        required: [true, 'Token is Required']
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'EXPIRED', 'USED'],
        default: 'ACTIVE'
    },
    expiresAt: {
        type: Date,
        required: [true, 'ExpiresAt is Required']
    }
}, { timestamps: true });

tokenSchema.methods = {
    generateToken: async function () {
        try {
            // Generate random bytes
            // Convert random bytes to string
            // Hash the random string
            const [randomString, hashToken] = await Promise.all([
                generateRandomBytesAsync(32).then((randomBytes) => randomBytes.toString('hex')),
                argon2.hash(randomString, {
                    type: argon2.argon2id,
                    memoryCost: 2 ** 16,
                    hashLength: 50
                })
            ]);

            // Save the hash token and expiresAt and start the token expiration
            this.token = hashToken;
            this.expiresAt = Date.now() + config.TOKEN_EXPIRY;
            this.startTokenExpiration();

            // Return random string
            return randomString;
        } catch (error) {
            throw error;
        }
    },

    verifyToken: async function (receivedToken) {
        if (this.status === 'EXPIRED') {
            throw new Error('Token is Expired');
        }
        if (this.status === 'USED') {
            throw new Error('Token is Already Used');
        }
        if (this.status === 'ACTIVE') {
            try {
                const isTokenValid = await argon2.verify(this.token, receivedToken);
                if (isTokenValid) {
                    this.status = 'USED';
                    clearInterval(this.expireTokenInterval);
                }
                return isTokenValid;
            } catch (error) {
                throw error;
            }
        }
    },

    startTokenExpiration: async function () {
        try {
            this.expireTokenInterval = setInterval(async () => {
                if (this.status === 'ACTIVE' && this.expiresAt < Date.now()) {
                    this.status = 'EXPIRED';
                    clearInterval(this.expireTokenInterval);
                }
            }, config.TOKEN_EXPIRY);
        } catch (error) {
            throw error;
        }
    }
};

export default mongoose.model('Token', tokenSchema);