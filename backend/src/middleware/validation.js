import { check, validationResult } from 'express-validator';
import { APIResponse } from "../utils/common.js"

export const validationCheck = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.errors.length) {
        res.send(new APIResponse(0, "Error", errors));
    } else {
        next();
    }
}

//Rules for Auth Module
export const authRules = {
    signUp: [
        check("name").notEmpty().withMessage("Name is required"),
        check("email").isEmail().withMessage("Valid Email required"),
        check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 character long"),
        check("role").notEmpty().withMessage("Role is required"),
    ],
    login: [
        check("email").isEmail().withMessage("Valid Email required"),
        check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 character long"),
    ]
} 

//Rules for Batches
export const batchRules = [
    check("batchId").notEmpty().withMessage("Batch id is required"),
    check("batchName").notEmpty().withMessage("Batch name is required"),
]

//Rules for cylinder module
export const cylinderRules = {
    addCylinder : [
        check("batchId").isMongoId().withMessage("Batch id should be an mongo object id"),
        check("filledStatus").notEmpty().withMessage("Valid filled status is required"),
        check("replacementRequest").notEmpty().withMessage("Replacement status is required"),
        check("status").notEmpty().withMessage("Status is required"),
    ],
    updateCylinder: [
        check('id').isMongoId().withMessage("cylinder id should be an mongo object id"),
        check("batchId").isMongoId().withMessage("Batch id should be an mongo object id"),
        ],
    cylinderParamValidation: [
        check('id').notEmpty().withMessage("Cylinder id is required"),
    ],
}
export const userRules = [
    check("name").notEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Valid Email required"),
    check("role").notEmpty().withMessage("Role is required"),
    check("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 character long"),
];

//Rules for Site Module
export const siteRules = [
    check("siteName").notEmpty().withMessage("siteName is required"),
    check("siteName").isString().withMessage("incorrect input format"),
    check("latitude").notEmpty().withMessage("latitude is required"),
    check("latitude").isNumeric().withMessage("incorrect input format"),
    check("longitude").notEmpty().withMessage("longitude is required"),
    check("longitude").isNumeric().withMessage("incorrect input format"),

];
