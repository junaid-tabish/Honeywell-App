import express from 'express';
const router = express.Router();
import { userLogin, userRegistration, sendUserPasswordResetEmail, userPasswordReset, changeUserPassword, loggedUser } from './controller.js';
import {checkUserAuth} from '../../middleware/authentication.js';
import {authRules, validationCheck} from '../../middleware/validation.js'

// Route Level Middleware - To Protect Route
router.use('/changepassword', checkUserAuth)
router.use('/loggeduser', checkUserAuth)

export default [
    // Public Routes
    router.post('/register',[authRules.signUp, validationCheck, userRegistration]),
    router.post('/login',[authRules.login, validationCheck, userLogin]),
    router.post('/send-reset-password-email', sendUserPasswordResetEmail),
    router.post('/reset-password/:id/:token', userPasswordReset),

    // Protected Routes
    router.post('/changepassword', changeUserPassword),
    router.get('/loggeduser', loggedUser),
    
]