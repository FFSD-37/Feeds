import Story from "../models/storiesSchema.js";
import User from "../models/users_schema.js";

const handlegetstories = async(req, res) => {
    try{
    const { data } = req.userDetails;
    const user = await User.findOne({ username: data[0] }).lean();

    let followings = user.followings;
    
    followings = await User
        .find({ username: { $in: followings.map(f => f.username) } })
        .select('username profilePicture -_id')
        .lean()
        .then(docs =>
            docs.map(({ username, profilePicture }) => ({
                username,
                avatarUrl: profilePicture
            }))
        );
    
    followings=[...followings,{username:data[0],avatarUrl:user.profilePicture}];
    
    let story=await Story.find({
        username:{ $in: followings.map(f => f.username) },
        createdAt: { $gt: new Date(Date.now() - 1000 * 60 * 60 * 24) }
    }).sort({createdAt:-1}).lean();

    story=story.map((s)=>{
        if(user.likedStoriesIds?.includes(s._id.toString())){
            return {...s,liked:true};
        }
        else{
            return {...s,liked:false};
        }
    });

    const mapFriend_story=story.map((s)=>({...s,avatarUrl:followings.find(f=>f.username===s.username).avatarUrl}));
    console.log(mapFriend_story);
    
    return res.render("stories", { img: data[2], currUser: data[0],  stories:mapFriend_story, type: data[3]});
    }catch(err){
        console.log(err);
        return res.status(500).json({err:err.message})
    }
};

const handleLikeStory=async(req,res)=>{
    try {
        const {id}=req.params;
        if(!id) return res.status(400).json({ err: "Story ID is required" });

        let user=await User.findOne({username:req.userDetails.data[0]});
        let isUserliked=user.likedStoriesIds.find((storyId)=>storyId===id);
        if(isUserliked){
            user.likedStoriesIds=user.likedStoriesIds.filter((storyId)=>storyId!==id);
            await Story.findOneAndUpdate({id},{
                $inc:{likes:-1}
            })
        }
        else{
            user.likedStoriesIds.push(id);
            await Story.findOneAndUpdate({id},{
                $inc:{likes:1}
            })
        }

        await user.save();
        return res.json({success:true});
    } catch (error) {
        console.log(error);
        return res.status(500).json({err:error.message})
    }
}

export {
    handlegetstories,
    handleLikeStory
}