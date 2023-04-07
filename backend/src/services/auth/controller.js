import UserModel from '../../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import transporter from '../../config/emailConfig.js'
import { APIResponse } from '../../utils/common.js'
import NotificationModel from '../../models/notification.js'
import { USER_ADMIN } from '../../utils/constant.js'

export const userRegistration = async (req, res) => {
  const { name, email, password, role, passwordConfirmation, tc } = req.body
  const user = await UserModel.findOne({ email: email })
  if (user) {
    const response = new APIResponse(0, "Email already exists")
    res.send(response)
  } else {
    if (password === passwordConfirmation) {
      try {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const doc = new UserModel({
          name: name,
          email: email,
          password: hashPassword,
          role: role,
          tc: tc
        })
        await doc.save()
        const savedUser = await UserModel.findOne({ email: email })
        // Generate JWT Token
        const token = jwt.sign({ userID: savedUser._id, userRole: savedUser.role }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })

        const notify = new NotificationModel({message: `${name} was registerd as ${role.toLowerCase()}`, role: USER_ADMIN})
        await notify.save()
        const response = new APIResponse(1, "Registration Successfull", { "token": token, "role": savedUser.role })
        res.status(201).send(response)
      } catch (error) {
        console.log(error);
        const response = new APIResponse(0, "Unable to register")
        res.send(response)
      }
    } else {
      const response = new APIResponse(0, "Password and Confirm Password doesn't match")
      res.send(response)
    }
  }
}
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email: email })
    if (user != null) {
      const isMatch = await bcrypt.compare(password, user.password)
      if ((user.email === email) && isMatch) {
        // Generate JWT Token
        const token = jwt.sign({ userID: user._id, userRole: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
        const response = new APIResponse(1, "Login Successfull", { "token": token, "role": user.role })
        res.send(response)
      } else {
        const response = new APIResponse(0, "Email or Password is not Valid")
        res.send(response)
      }
    } else {
      const response = new APIResponse(0, "Email or Password is not Valid")
      res.send(response)
    }
  } catch (error) {
    console.log(error)
    const response = new APIResponse(0, "Unable to Login")
    res.send(response)
  }
}

export const changeUserPassword = async (req, res) => {
  const { password, passwordConfirmation } = req.body
  if (password !== passwordConfirmation) {
    const response = new APIResponse(0, "New Password and Confirm New Password doesn't match")
    res.send(response)
  } else {
    const salt = await bcrypt.genSalt(10)
    const newHashPassword = await bcrypt.hash(password, salt)
    await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } })
    const response = new APIResponse(1, "Password changed succesfully")
    res.send(response)
  }
}

export const loggedUser = async (req, res) => {
  res.send({ "user": req.user })
}

export const sendUserPasswordResetEmail = async (req, res) => {
  const { email } = req.body
  const user = await UserModel.findOne({ email: email })
  if (user) {
    const secret = user._id + process.env.JWT_SECRET_KEY
    const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '15m' })
    const link = `http://127.0.0.1:3000/reset/${user._id}/${token}`
    console.log(link)
    // Send Email
    let info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "HoneyWell- Password Reset Link",
      html: `<a href=${link}>Click Here</a> to Reset Your Password`
    })
    const response = new APIResponse(1, "Password Reset Email Sent... Please Check Your Email")
    res.send(response)
  } else {
    const response = new APIResponse(0, "Email doesn't exists")
    res.send(response)
  }
}

export const userPasswordReset = async (req, res) => {
  const { password, passwordConfirmation } = req.body
  const { id, token } = req.params
  const user = await UserModel.findById(id)
  const newSecret = user._id + process.env.JWT_SECRET_KEY
  try {
    jwt.verify(token, newSecret)
    if (password && passwordConfirmation) {
      if (password !== passwordConfirmation) {
        const response = new APIResponse(0, "New Password and Confirm New Password doesn't match")
        res.send(response)
      } else {
        const salt = await bcrypt.genSalt(10)
        const newHashPassword = await bcrypt.hash(password, salt)
        await UserModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })
        const response = new APIResponse(1, "Password Reset Successfully")
        res.send(response)
      }
    } else {
      const response = new APIResponse(0, "All Fields are Required")
      res.send(response)
    }
  } catch (error) {
    console.log(error)
    const response = new APIResponse(0, "Invalid Token")
    res.send(response)
  }
}


