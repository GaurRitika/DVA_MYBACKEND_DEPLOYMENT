
import UserModel from "../models/user.js"
import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken"




// Hello everyone , from Ritika Gaur , this is our Registration section//

export const Register = async(req, res) => {
    try {
        const {FullName, email, password} = req.body
        
        // Check if user exists
        const existUser = await UserModel.findOne({email})
        if(existUser) {
            return res.status(301).json({
                success: false, 
                message: "User already exists, please login"
            })
        }

        // Hash password
        const hashPassword = bcryptjs.hashSync(password, 10)

        // Create new user without profile image
        const NewUser = new UserModel({
            FullName,
            email,
            password: hashPassword
        })

        // Save user
        await NewUser.save()

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            user: NewUser
        })

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}






// This will be our Login section

const Login = async(req , res)=>{
    try{



        // if user forget to fill any field
        const {email , password} = req.body
        if(!email || !password){
            return res.status (400).json({success:false , message:"All Fields are required"})
        }



        // firstly , let's find the user
        const FindUser  = await UserModel.findOne({email})
        if(!FindUser){
            return res.status(400).json({success:false , message:"No user found in our database , please register"})
        }

        // after finding the email in the database , then we will compare their password
        const comparepassword = await bcryptjs.compare(password , FindUser.password)

if(!comparepassword){
    return res.status(400).json({success:false , message:"Invalid Password"})
}


// here , we will generate token

const token = jwt.sign({userId:FindUser._id} , process.env.JWT_SECRET)


res.cookie('token' , token,{
    httpOnly:true,
    secure:false,// false isiliye likha because yeh secure https ke liye kaam karta heh
    maxAge: 3*24*60*60*1000
}) 


res.status(200).json({success:true , message:"Login successfully" , user:FindUser , token})
    }
    catch(error){
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}










// This is our LogOut Section



// now this for logout
// const Logout = async(req , res)=>{
//     try{
// res.clearCookie('token');
// res.status(200).json({success:true , message:"Logout successfully" })
//     }catch(error){
//         console.log(error)
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// }

export { Login
    //  Logout
    }


