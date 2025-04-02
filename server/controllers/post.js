import Post from "../models/postSchema.js";

const handlepostupload=async(req,res)=>{
    try {
        
    if(!req.body.title || !req.body.url || !req.body.content || !req.body.author) return res.status(400).json({ err: "All fields are required" });

    const id=`${author}-${Date.now()}`

    await Post.insertOne({
        id,
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