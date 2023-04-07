import express from 'express';
const router = express.Router();
import { addDistributor, getDistributorById, updateDistributor,addSitesToDistributor, deleteDistributor, getDistributorBatch, updateAllotedBatch, getAllotedSitesOfDistributors, updateAllotedSite, getDistributorSites, getActiveDistributors, findDistributor, getAllotedBatchesOfDistributors, updateDistributorBatch } from './controller.js';
import { userRules, validationCheck } from "../../../middleware/validation.js"
import { checkAdminAuth } from '../../../middleware/authentication.js';

export default [
    router.get('/distributors', checkAdminAuth, findDistributor), //search || sort || filter || pagination
    router.post('/distributor', checkAdminAuth, [userRules, validationCheck, addDistributor]), //add distributor
    router.get('/distributor/:id', checkAdminAuth, getDistributorById), //get data by Id
    router.put('/distributor/:id',checkAdminAuth, updateDistributor),  //update data
    router.put('/distributor/batch/:id',checkAdminAuth, updateDistributorBatch),  //update data
    router.put('/distributor/addsite/:id',checkAdminAuth, addSitesToDistributor),//add sites
    router.delete('/distributor/:id', checkAdminAuth, deleteDistributor), // delete data
    router.get('/distributors/list', getActiveDistributors), // get all active distributors
    router.get('/distributors/sites/:id', getDistributorSites), // get all active distributors
    router.get('/distributors/allotedsites/:id', getAllotedSitesOfDistributors), // get list of allocated sites to distributor
    router.put('/distributors/allotedsites/sites/:id',checkAdminAuth, updateAllotedSite), // delete or remove the allocated site to distributor

    router.get('/distributors/batches/:id', getDistributorBatch), // get all active distributors
    router.get('/distributors/allotedbatches/:id', getAllotedBatchesOfDistributors), // get list of allocated sites to distributor
    router.put('/distributors/allotedbatches/batches/:id',checkAdminAuth, updateAllotedBatch), // delete or remove the allocated site to distributor

]
