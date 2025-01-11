import User from "../model/userModel.js";

export async function getUser(req,res){
    
}
export async function regisUser(req,res){
    const {username,password} = req.body;
    let arr = [];
    const name =  await User.find({username:username});
    if (name.length == 0){
        const newUser = new User({
            username,
            password,
            arr
        });
        try{
            await newUser.save();
            res.status(200).json({message:"Complete create user!"});
        }catch(error){
            console.error(error);
            res.status(400).json({message:"Fail to save user!"});
        }
    }else{
        res.status(500).json({message:"username is already exist"})
    }
    
}