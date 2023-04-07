import express from 'express';
const router = express.Router();
import { userRules, validationCheck } from "../../../middleware/validation.js"
import { addContractor,  updateContractor, getContractorById, deleteContractor,findContractor, getActiveContractors, getContractorSites, getSitesOfContractor, deleteAllotedSite, assignCylinder, cylindersOfBatch, detailsOfBatch, updateContractorSites } from './controller.js';
import { checkAdminAuth } from '../../../middleware/authentication.js';

export default [
    router.get('/contractors', findContractor), //search || sort || filter || pagination
    router.post('/contractor',[userRules, validationCheck, addContractor]), //add distributor
    router.get("/contractor/:id", getContractorById), //get data by Id
    router.put('/contractor/:id',  updateContractor),  //update data
    router.delete('/contractor/:id', deleteContractor), // delete data
    router.get('/contractors/list',getActiveContractors), // get acitive contractors
    
    //assign sites to contractor
    router.get('/contractor/sites/:id',getContractorSites),// get sites to be alloted to contractor
    router.get('/contractor/allotedsites/:id', getSitesOfContractor),//getting sites already alloted to contractor
    router.put('/contractor/allotedsites/:id', deleteAllotedSite),
    router.put("/contractor/updatesites/:id",updateContractorSites),//allot sites to contractor

    //assign cylinder to contractor
    router.put("/contractor/assigncylinder/:id",assignCylinder),//assign cylinder to contractor
    router.get("/contractor/assigncylinder-cylinders/:id",cylindersOfBatch),//get details of cylinder in a batch
    router.get("/contractor/assigncylinder-batches/:id",detailsOfBatch),//details batches assigned to distributor
    
]
