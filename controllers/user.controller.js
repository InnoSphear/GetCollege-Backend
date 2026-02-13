import User from "../models/user.model.js";

export const register = async (req,res) => {
  try {
    const { name, email, mobile, course, state, city } = req.body;
    if (!name || !email || !mobile || !course || !state || !city) {
      return res.status(400).json({
        message:"All feilds are required"
      })
    }

    const existingUser = await User.findOne({
        $or:[
            {email},
            {mobile}
        ]
    })
    if(existingUser){
        return res.status(400).json({
            message:"User alreday exist"
        })
    }
    const user = await User.create({
        name,
        email,
        mobile,
        course,
        state,
        city,
    })

    return res.status(200).json({
        message:"Registered sucessfuly",
        data:user
    })

  } catch (error) {
    return res.status(500).json({
        message:"Internal server Error"
      })
  }
};


export const getUser = async(req, res)=>{
    try {
        const getUser = await User.find()
        return res.status(200).json({
            getUser
        })
    } catch (error) {
        return res.status(500).json({
        message:"Internal server Error"
      })
    }
}
