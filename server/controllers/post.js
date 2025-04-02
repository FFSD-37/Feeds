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