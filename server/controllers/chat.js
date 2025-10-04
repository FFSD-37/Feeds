import Chat from "../models/chatSchema.js";
import User from "../models/users_schema.js";

const getChatpage = async (req, res) => {
    const { data } = req.userDetails;
    const user = await User.findOne({ username: data[0] });

    let friends = user.followings.filter(f => user.followers.some(fr => fr.username === f.username));
    // console.log(friends);
    const currentUsername = data[0];
    const friendUsernames = friends.map(f => f.username);

    // Step 1: Find all chats involving current user
    const chats = await Chat.find({
    $or: [
        { from: currentUsername },
        { to: currentUsername }
    ]
    }).lean();

    // Step 2: Collect all other usernames from chats
    const otherUsernamesSet = new Set();

    chats.forEach(chat => {
    if (chat.from !== currentUsername) otherUsernamesSet.add(chat.from);
    if (chat.to !== currentUsername) otherUsernamesSet.add(chat.to);
    });

    // Step 3: Remove existing friends
    const nonFriendUsernames = Array.from(otherUsernamesSet).filter(
    username => !friendUsernames.includes(username)
    );

    // Step 4: Lookup users not in friends by username
    const nonFriendUsers = await User.find({
    username: { $in: nonFriendUsernames }
    }, { username: 1 }).lean(); // include only _id and username

    console.log(nonFriendUsers, friends); // These are usernames you've chatted with but aren't friends
    
    friends=[...friends,...nonFriendUsers];
    friends = await User
        .find({ username: { $in: friends.map(f => f.username) } })
        .select('username profilePicture -_id')
        .lean()
        .then(docs =>
            docs.map(({ username, profilePicture }) => ({
                username,
                avatarUrl: profilePicture
            }))
        );

    return res.render("chat", { img: data[2], currUser: data[0], friends });
};

const getChat = async (req, res) => {
    try {
        const { data } = req.userDetails;
        const { username } = req.params;

        const chats = await Chat.find({
            $or: [{ from: data[0], to: username }, { to: data[0], from: username }]
        }).sort({ createdAt: 1 });
        
        return res.json({ chats })
    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}

export { getChat, getChatpage };