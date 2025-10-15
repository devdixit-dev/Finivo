import { request, response } from "express";

export const Register = async(req, res) => {
  try{
    const { fullname, email, password } = req.body;
    if(!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required for registration'
      });
    }
  }
  catch(err) {
    console.error(`Error in register controller - ${err}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}