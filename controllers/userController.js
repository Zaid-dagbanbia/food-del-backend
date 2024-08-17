import userModel from "../models/userModel.js";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";


//login user
const loginUser = async (req, res) => {

    const {email, password} = req.body;
    try {
        
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"Password is incorrect"
            });

        }

        const token = createToken(user._id);
        res.status(200).json({
            success:true,
            message:"Logged in successfully",
            token
        })





    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }


}

const createToken = (id) => {
    return Jwt.sign({id}, process.env.JWT_SECRET);
}


//register user
const registerUser = async(req, res) => {
    const {name,password,email} = req.body;
    try{

        //checking is user already exist
        const exists = await userModel.findOne({email});
        if(exists){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            });
        }
        //validating email format & strong password

        if(!validator.isEmail(email)){

            return res.status(400).json({
                success:false,
                message:"Please enter a valid  email"
            });

        }

        if(password.length < 8){
            return res.status(400).json({
                success:false,
                message:"Password should be at least 8 characters long"
            });    
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        //creating new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

       const user =  await newUser.save();

       const token = createToken(user._id)

       res.json({
           success:true,
           message:"User registered successfully",
           token
       })

    }catch(error){
        console.log(error.stack);
        res.status(500).json({
            success:false,
            message:"Server Error"
        });

    }

}


export {
    loginUser,
    registerUser,
}