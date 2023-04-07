import express from 'express';
const router = express.Router();

import { veiwAllCylinders, addCylinder, updateCylinder, viewCylinder, deleteCylinder, getCylindersOnStatus, cylindersCount } from './controller.js'
import { cylinderRules, validationCheck } from '../../../middleware/validation.js';
import { checkAdminAuth } from '../../../middleware/authentication.js';

export default [
    router.get('/cylinders',checkAdminAuth, veiwAllCylinders),    //view all cylinders
    router.post('/cylinder',checkAdminAuth, addCylinder),     //add cylinder
    router.put('/cylinder/:id', checkAdminAuth, [cylinderRules.updateCylinder, validationCheck, updateCylinder]),    //edit cylinder
    router.get('/cylinder/:id',checkAdminAuth, [cylinderRules.cylinderParamValidation, validationCheck, viewCylinder]),     //get single cylinder with cylinder id
    router.delete('/cylinder/:id', checkAdminAuth, [cylinderRules.cylinderParamValidation, validationCheck, deleteCylinder]),    //delete cylinder
    router.get('/cylinderList',checkAdminAuth, getCylindersOnStatus),   //get cylinder group
    router.get('/cylindersCount',checkAdminAuth, cylindersCount)
]