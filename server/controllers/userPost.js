import { verify_JWTtoken } from "cookie-string-parser";
import Post from "../models/postSchema.js";
import User from "../models/users_schema.js";

const handlePostupload=async(req,res)=>{
    try {
    const authorDetails=verify_JWTtoken(req.cookies.uuid, process.env.USER_SECRET);
    
    if(!authorDetails) return res.status(401).json({ err: "Unauthorized" });
    if(!req.body.title || !req.body.url || !req.body.content) return res.status(400).json({ err: "All fields are required" });

    const id=`${authorDetails.data[0]}-${Date.now()}`

    await User.updateOne({ username: authorDetails.data[0] }, { $push: { postIds: id } });
    await Post.insertOne({
        id,
        title:req.body.title,
        url:req.body.url,
        type:req.body.type,
        content:req.body.content,
        author:authorDetails.data[0],
        avatarUrl:authorDetails.data[2]
    });

    return res.status(200).json({ msg: "Post uploaded successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ err: error.message });
    }
};


const handlePostDelete = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ err: "Post ID is required" });
        }

        const authorDetails = verify_JWTtoken(req.cookies.uuid, process.env.USER_SECRET);
        if(!authorDetails||authorDetails.data[0]!==id.split("-")[0]) return res.status(401).json({ err: "Unauthorized" });

        await User.updateOne({ username: authorDetails.data[0] }, { $pull: { postIds: id } });
        const deletedPost = await Post.deleteOne({ id });

        if (deletedPost.deletedCount === 0) {
            return res.status(404).json({ err: "Post not found" });
        }

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ err: error.message });
    }
};

const handleGetpost=async(req,res)=>{
    try{
    const {id}=req.params;
    if(!id) return res.status(400).json({ err: "Post ID is required" });
    const userDetails=verify_JWTtoken(req.cookies.uuid, process.env.USER_SECRET);
    if(!userDetails) return res.status(401).json({ err: "Unauthorized" });
    const userType=userDetails.data[3];
    
    const postDetails=await Post.findOne({
        id
    });

    if(!postDetails) return res.status(404).json({ err: "Post not found" });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({err:error.message})
    }
}

const suggestedPost=async(req,res)=>{
    try{
        const createdAt=req.query.createdAt || new Date();

        const userDetails=verify_JWTtoken(req.cookies.uuid, process.env.USER_SECRET);
        if(!userDetails) return res.status(401).json({ err: "Unauthorized" });
        const userType=userDetails.data[3];
        
        const posts=await Post.find({
            createdAt: { $lt: createdAt },
        }).sort({createdAt:-1}).limit(5);

        if(!posts) return res.status(404).json({ err: "Post not found" });
        
        return res.json({posts})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({err:error.message})
    }
}

const suggestedReels=async(req,res)=>{
    try{
        const createdAt=req.query.createdAt || new Date();

        const userDetails=verify_JWTtoken(req.cookies.uuid, process.env.USER_SECRET);
        if(!userDetails) return res.status(401).json({ err: "Unauthorized" });
        const userType=userDetails.data[3];
        const posts=await Post.find({
            type:"Reels",
            createdAt: { $lt: createdAt },
        }).sort({createdAt:-1}).limit(5);
        if(!posts) return res.status(404).json({ err: "Post not found" });
        return res.json({posts})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({err:error.message})
    }
}

export {handlePostupload, handlePostDelete, handleGetpost, suggestedPost, suggestedReels};