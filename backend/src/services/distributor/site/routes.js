import express from 'express';
const router = express.Router();
import { siteRules, validationCheck } from '../../../middleware/validation.js';
import { updateData, addData, deleteData, getData, getActiveSites, findSites } from "../site/controller.js"

export default [
    router.get('/sites', getData),
    router.get('/sites/list', getActiveSites),
    router.post('/site', [siteRules, validationCheck, addData]),
    router.delete('/site/:id', deleteData),
    router.put('/site/:id', [siteRules, validationCheck, updateData]),
    router.get('/sites/search', findSites)
]
