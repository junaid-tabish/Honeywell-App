import * as Yup from "yup";


// Registration Validation

export const registration= Yup.object({
    name: Yup.string().min(4).max(20).required("Please enter your name"),
    email: Yup.string().email().required("Please enter your email"),
    password: Yup.string().min(6).required("Please enter your password") ,
    passwordConfirmation: Yup.string()
    .required("Please enter same password ")
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    role: Yup.string().required("Please select your role")
   });


//Login Validation

export const login = Yup.object({
    email: Yup.string().email().required("Please enter your email"),
    password: Yup.string().min(6).required("Please enter your password") ,
   
   });


//Admin----->Distributor validation
export const Distributor= Yup.object({
    name: Yup.string().min(4).max(20).required("Please enter your name"),
    email: Yup.string().email().required("Please enter your email"),
    password: Yup.string().min(6).required("Please enter your password") ,
    status: Yup.number().required("Please select status")
    // role: Yup.string().required("Please select your role")
   });

//Admin.........>Contractor validation
export const Contractor = Yup.object({
    name: Yup.string().min(4).max(20).required("Please enter your name"),
    email: Yup.string().email().required("Please enter your email"),
    password: Yup.string().min(6).required("Please enter your password") ,
    status: Yup.number().required("Please select status")
   });

//Admin---------------->Batch Validation
export const batch = Yup.object({
    batchName: Yup.string().min(4).max(20).required("Please enter name"),
    batchId: Yup.string().min(5).required("Please enter ID"),
    
   });

//Admin----------------------->Site validation
export const Site= Yup.object({
    siteName:Yup.string().required("Site Name is required").matches(/^[a-zA-Z ]+$/,"Enter Valid Name"),
    latitude:Yup.string().required("Please enter your latitude"),
    longitude: Yup.string().required("Please enter your longitude") ,
    distributorId: Yup.string().required("Please enter your distributorId") ,
    contractorId: Yup.string().required("Please enter your contractorId") ,
    status: Yup.string().required("Please Select status") 
    
   });