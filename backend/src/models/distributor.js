import mongoose  from "mongoose";

//Defining Schema for Distributor Role
const distributorSchema = new mongoose.Schema({
    //id,distributorid,contractorid, daily scan ststus, up.cre
    distributorId: {
        type: Number,
        require: true,
        trim: true,
    },
    contractorId: {
        type: Number,
        require: true,
        trim : true
    },
    dailyScanStatus: {
        type : Boolean,
        require : true,  // true -> scanning done ||  false -> scanning pending
        default : false  
    }

},{timestamps: true});
const DistributorModel = mongoose.model("distributor",distributorSchema);
export default DistributorModel;