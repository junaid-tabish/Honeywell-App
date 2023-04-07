import jwt from 'jsonwebtoken'
import UserModel from '../models/user.js'
import { APIResponse } from '../utils/common.js'
import { USER_ADMIN, USER_CONTRACTOR, USER_DISTRIBUTOR } from '../utils/constant.js'
export const checkUserAuth = async (req, res, next) => {
  let token;
  let response;
  const { authorization } = req.headers
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // Get Token from header
      token = authorization.split(' ')[1]

      // Verify Token
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)

      // Get User from Token
      req.user = await UserModel.findById(userID).select('-password')

      next()
    } catch (error) {
      console.log(error)
      response = new APIResponse(0, "Unauthorized user");
      res.status(401).send(response);
    }
  }
  if (!token) {
    const response = new APIResponse(0, "Unauthorized user");
    res.status(401).send(response);
  }
}

export const checkAdminAuth = async (req, res, next) => {
  const { authorization } = req.headers
  const result = await checkAuth(authorization, USER_ADMIN);
  // console.log("result", result);
  if (result.status) {
    req.user = result.data;
    next();
  } else {
    res.send(result);
  }
}

export const checkDistributorAuth = async (req, res, next) => {
  const { authorization } = req.headers
  const result = await checkAuth(authorization, USER_DISTRIBUTOR);
  // console.log("result", result);
  if (result.status) {
    req.user = result.data;
    next();
  } else {
    res.status(401).send(result);
  }
}

export const checkContractorAuth = async (req, res, next) => {
  const { authorization } = req.headers
  const result = await checkAuth(authorization, USER_CONTRACTOR);
  // console.log("result", result);
  if (result.status) {
    req.user = result.data;
    next();
  } else {
    res.status(401).send(result);
  }
}

const checkAuth = async (authorization, userRole) => {
  let response;
  if (!authorization) {
    response = new APIResponse(0, "Token not found");

  } else {
    const token = authorization.split(' ')[1];
    const decoded = jwt.decode(token);
    const decodedUserRole = decoded?.userRole;

    if (authorization && authorization.startsWith('Bearer') && decodedUserRole === userRole) {
      try {

        // Verify Token
        const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)

        // Get User from Token
        const userData = await UserModel.findById(userID).select('-password')
        response = new APIResponse(1, "User validated", userData);
      } catch (error) {
        response = new APIResponse(0, "Unauthorized user");
      }
    } else {
      response = new APIResponse(0, "Unauthorized user");
    }
  }
  return response;
}
