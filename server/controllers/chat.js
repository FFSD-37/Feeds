import Chat from "../models/chatSchema.js";
import User from "../models/users_schema.js";

const getChatpage = async(req, res) => {
    const { data } = req.userDetails;
    const user=await User.findOne({username: data[0]});
    
    const friends=user.followings.filter(f=>user.followers.some(fr=>fr.username===f.username));console.log(user);
    
    console.log(friends);
    
    return res.render("chat", { img: data[2], currUser: data[0], friends });
};

const getChat = async(req, res) =>{
    try{
    const { data } = req.userDetails;
    const { username } = req.params;

    const chats=await Chat.find({
        $or:[{sender: data[0], receiver: username},{sender: username, receiver: data[0]}]
    }).sort({createdAt: -1});

    return res.json({chats})
    }catch(err){
        return res.status(500).json({err: err.message})
    }
}

export { getChat, getChatpage };