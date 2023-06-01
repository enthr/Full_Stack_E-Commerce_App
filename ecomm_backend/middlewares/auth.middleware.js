import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import CustomError from '../utils/customError.js';
import config from '../config/index.js';

export const isLoggedIn = asyncHandler(async (req, _res, next) => {
    let token;

    if (req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))) {
        token = req.cookies.token || req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new CustomError('Not authorized to access this route', 401);
    }

    try {
        const decodedJwtPayload = jwt.verify(token, config.JWT_SECRET);
        req.user = await User.findById(decodedJwtPayload._id, 'fullName email role status contact');
        next();
    } catch (error) {
        throw new CustomError('Not authorized to access this route. Please Login!', 401);
    }
});

export const authorize = (...requiredRoles) => asyncHandler(async (req, _res, next) => {
    if (!requiredRoles.includes(req.user.role)) {
        throw new CustomError(`You Are Not Authorized To Access This Route`, 403);
    }
    if (req.user.status === 'BLOCKED') {
        throw new CustomError(`Your Account is Blocked. Please Contact Admin`, 403);
    }
    if (req.user.status === 'UNVERIFIED') {
        throw new CustomError(`You are not verified. Please verify your email`, 403);
    }
    next();
});