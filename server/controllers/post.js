import Post from "../models/postSchema.js";

const handlepostupload=async(req,res)=>{
    try {

    await Post.insertOne({
        title:req.body.title,
        url:req.body.url,
        content:req.body.content,
        author:req.body.author,
        avatarUrl:req.body.avatarUrl
    })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ err: error.message });
    }
};

export {handlepostupload};