import { EMPTY, FILLED, COUNTER_FEILT} from "../../../utils/constant.js";
import { APIResponse } from "../../../utils/common.js";
import { getCylinderDetails, addNewcylinder, getAllCylinders, updateCylinderDetails, getSpecificCylinderData, 
        deleteCylinderDetails, getCylindersOnBatchStatus, getDocumentsCount} from '../../../models/cylinder.js';



//view all cylinders
export const veiwAllCylinders = async (req, res) => {
    try {
        const cylindersData = await getAllCylinders(req, res)
        if(cylindersData){
            const response = new APIResponse(1, "Data Found", cylindersData)
            res.status(200).send(response);
        }else{
            const response = new APIResponse(0, "Data Not Found")
            res.status(200).send(response);
        }
    } catch (error) {
        console.log(error)
    }
    
}


//add new cylinder
export const addCylinder = async (req, res) => {
    try {
        const {cylinderId} = req.body
        const isCylinderExist = await getCylinderDetails(cylinderId)
        if(isCylinderExist){
            const response = new APIResponse(0, 'Cylinder id already exists')
            res.send(response)
        }else{
            const addCylinderRes = await addNewcylinder(req.body)
            if(addCylinderRes === 1){
                const response = new APIResponse(1, "Successfully new cylinder details added into DB")
                res.status(201).send(response)
            }else{
                const response = new APIResponse(0, "Issue in inserting details into DB")
                res.send(response)
            }
        }
    } catch (error) {
        console.log(error)
    }  
}

//update cylinder
export const updateCylinder = async (req, res) => {
    try {
        const updateResp = await updateCylinderDetails(req)
        if(updateResp === 1){
            const response = new APIResponse(1, "Successfully cylinder details are updated into DB")
            res.status(200).send(response)
        }else{
            const response = new APIResponse(0, "No cylinder found or Issue in updating cylinder details into DB")
            res.send(response)
        }
    } catch (error) {
        console.log(error)
    }    
}

//view specific cylinder
export const viewCylinder = async (req, res) => {
    try {
        const cylinder = await getSpecificCylinderData(req)
        if(cylinder === null){
            const response = new APIResponse(0, "Data Not Found")
            res.send(response)
        }else{
            const response = new APIResponse(1, "Data Found", cylinder)
            res.status(200).send(response)
        }
    } catch (error) {
        console.log(error)
    }
}

//delete cylinder
export const deleteCylinder = async (req, res) => {
    try {const cylinder= await getSpecificCylinderData(req)
        
        if(!(cylinder.batchId)){
             const deleteCylinder = await deleteCylinderDetails(req.params.id)
        if(!deleteCylinder){
            const response = new APIResponse(0, "Cylinder Details are Not Found")
            res.send(response)
        }else{
            const response = new APIResponse(1, "Deleted Successfully")
            res.send(response)
        }
        }else{const response = new APIResponse(0, "cylinder is assigned to batch")
            res.send(response)}
    } catch (error) {
        console.log(error)
    }
}

//get cylinder group
export const getCylindersOnStatus = async (req, res) => {
    try {
        const cylinders = await getCylindersOnBatchStatus(req)
        if(!cylinders || cylinders.length === 0){
            const response = new APIResponse(0, "No Data Found")
            res.send(response)
        }else{
            const response = new APIResponse(1, "Data Found", cylinders)
            res.status(200).send(response)
        }
    } catch (error) {
        console.log(error)
    }
}

//get cylinders count
export const cylindersCount = async( req, res) => {
    try {
        const cylinderId = await getDocumentsCount()
        const response = new APIResponse(1, "Id Created Successfully", cylinderId)
        res.status(200).send(response)
    } catch (error) {
        console.log(error)
    }
}