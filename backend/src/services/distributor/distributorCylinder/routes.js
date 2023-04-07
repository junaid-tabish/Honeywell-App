import express from 'express';
const router = express.Router();
import { getCylinders } from './contractor.js'


export default [
    router.get('/cylinders', getCylinders),
]