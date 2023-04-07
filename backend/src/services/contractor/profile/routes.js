import express from 'express';
const router = express.Router();
import {getProfile, counter,inventoryCounter} from './controller.js';
import {checkContractorAuth} from "../../../middleware/authentication.js"
export default [
  router.get('/profile/:id',checkContractorAuth,getProfile),
 
  //Dashboard Routes
  router.get('/count',checkContractorAuth,counter),
  router.get('/inventory',inventoryCounter)
]
