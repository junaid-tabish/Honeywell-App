import express from 'express';
const router = express.Router();
import { counter ,inventoryCounter,getProfile } from './controller.js';
import { checkAdminAuth } from '../../../middleware/authentication.js';
export default [
  router.get('/profile/:id',checkAdminAuth ,getProfile),

  //Dashboard Routes
  router.get('/count',checkAdminAuth,counter),
  router.get('/inventory',inventoryCounter)
  
]
