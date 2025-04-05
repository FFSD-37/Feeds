import Channel from "../models/channelSchema.js";
import mongoose from "mongoose";

const create_channel = async (req, res) => {
    try {
        const {
            channelName,
            channelDescription,
            channelCategory,
            channelLogo,
            channelAdmin,
            channelMembers
        } = req.body;

        // 🔍 Validation: Check for required fields
        if (!channelName || !channelDescription || !channelCategory || !channelAdmin) {
            return res.status(400).json({ error: "All required fields must be filled." });
        }

        // 🔍 Check if the channel name already exists
        const existingChannel = await Channel.findOne({ channelName: channelName.trim() });
        if (existingChannel) {
            return res.status(409).json({ error: "Channel name already exists." });
        }

        // 🏗 Create new channel document
        const newChannel = new Channel({
            channelName: channelName.trim(),
            channelDescription: channelDescription.trim(),
            channelCategory,
            channelLogo: channelLogo || process.env.DEFAULT_USER_IMG,
            channelAdmin: new mongoose.Types.ObjectId(channelAdmin),
            channelMembers: channelMembers || [], // Optional: default to empty array
            savedPostsIds: [],
            likedPostsIds: [],
            archivedPostsIds: [],
            postIds: []
        });

        await newChannel.save();

        return res.status(201).json({
            message: "Channel created successfully!",
            channel: newChannel
        });

    } catch (error) {
        console.error("Error creating channel:", error);
        return res.status(500).json({ error: error.message });
    }
};

export { create_channel };
