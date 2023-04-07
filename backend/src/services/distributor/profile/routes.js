import express from 'express';
const router = express.Router();
import {getProfile, counter,inventoryCounter}  from './controller.js';
import {checkDistributorAuth} from "../../../middleware/authentication.js"

export default [
  router.get('/profile/:id',checkDistributorAuth ,getProfile),
  
  //Dashboard Routes
  router.get('/count',checkDistributorAuth,counter),
  router.get('/inventory',inventoryCounter)
]
