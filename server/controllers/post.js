import { verify_JWTtoken } from "cookie-string-parser";
import Post from "../models/postSchema.js";
import User from "../models/users_schema.js";

const handlepostupload=async(req,res)=>{
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

export {handlepostupload, handlePostDelete};