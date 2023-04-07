import express from 'express';
const router = express.Router();
import { getCylinders, replacementRequest, replacementRequestResponse } from './controller.js'


export default [
    router.get('/cylinders', getCylinders),
    router.put('/cylinder/replacement-request',replacementRequest),
    router.put('/cylinder/replacement-request-response',replacementRequestResponse)
]