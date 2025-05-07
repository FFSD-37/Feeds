import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { create_JWTtoken } from 'cookie-string-parser';
import User from '../models/users_schema.js';
import Post from '../models/postSchema.js';
import Report from "../models/reports.js";
import Payment from "../models/payment.js";
import ActivityLog from "../models/activityLogSchema.js"
import ResetPassword from "../models/reset_pass_schema.js";
import bcrypt, { compare } from 'bcrypt';
import Feedback from '../models/feedbackForm.js';
import DelUser from '../models/SoftDelUsers.js';
import Notification from '../models/notification_schema.js';


async function storeOtp(email, otp) {
  try {
    const existing = await ResetPassword.findOne({ email });

    if (existing) {
      existing.otp = otp;
      await existing.save();
      console.log(`✅ OTP for ${email} updated successfully.`);
    } else {
      await ResetPassword.create({ email, otp });
      console.log(`✅ OTP for ${email} saved successfully.`);
    }
  } catch (err) {
    console.error(`❌ Error storing OTP for ${email}:`, err);
  }
}

async function getOtp(email) {
  try {
    const record = await ResetPassword.findOne({ email });
    return record ? record.otp : null;
  } catch (err) {
    console.error(`❌ Error retrieving OTP for ${email}:`, err);
    return null;
  }
}

const handleSignup = async (req, res) => {
  console.log(req.body)
  try {
    const pass = await bcrypt.hash(req.body.password, 10);
    const userData = {
      fullName: req.body.fullName,
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: pass,
      dob: req.body.dob,
      profilePicture: req.body.profileImageUrl ? req.body.profileImageUrl : process.env.DEFAULT_USER_IMG,
      bio: req.body.bio || "",
      gender: req.body.gender,
      type: req.body.acctype,
      isPremium: false,
      termsAccepted: !req.body.terms
    };

    await User.create(userData);
    await ActivityLog.create({username: req.body.username, id: `#${Date.now()}`, message: "You Registered Successfully!!"});
    return res.render("login", { loginType: "Email", msg: "User Registered Successfully" });
  }
  catch (err) {
    if (err.cause.code === 11000) {
      const fields = Object.keys(err.cause.keyValue);
      return res.render("Registration", { msg: `User with ${fields[0]} already exists` });
    }
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.render("Registration", { msg: errors });
    };
  }
}

const handledelacc = async (req, res) => {
  try {
    console.log(req.body);
    const { data } = req.userDetails;
    const user = await User.findOne({ username: data[0] }).lean();

    if (!(await bcrypt.compare(req.body.password, user.password))) {
      return res.render("delacc", {
        img: data[2],
        currUser: data[0],
        msg: "Incorrect Password"
      });
    }
    const liked = user.likeIds || [];
    for (const postId of liked) {
      const post = await Post.findById(postId);
      if (post) {
        post.likes -= 1;
      }
    }
    await DelUser.insertOne(user);

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'DELETION ON ACCOUNT',
      text: `Your Account ${user.username} from FEEDS has been deleted on Date: ${new Date()}. If it's not you, please Restore your account using /restore url from the login page. It's been great having you.`
    };
    
    await ActivityLog.create({username: user.username, id: `#${Date.now()}`, message: "Your Account has been delete"})
    await User.findByIdAndDelete({ _id: user._id });
    try {
      await transporter.sendMail(mailOptions);
      res.render("login", { loginType: "Email", msg: "Account deleted successfully." });
    }
    catch (err) {
      console.error('Error sending email:', err);
      return res.status(500).json({ msg: "Failed to send OTP" });
    }

  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).send("Internal Server Error");
  }
};

const handleLogin = async (req, res) => {
  try {
    const user = await User.findOne(req.body.identifykro === 'username' ? { username: req.body.identifier } : { email: req.body.identifier });
    if (!user) return res.render("login", { loginType: "Email", msg: "Username Doesn't exists" });
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) return res.render("login", { loginType: "Username", msg: "Incorrect password" });

    const token = create_JWTtoken([user.username, user.email, user.profilePicture, user.type], process.env.USER_SECRET, '30d');
    res.cookie('uuid', token, { httpOnly: true });
    return res.redirect("/home");
  }
  catch (e) {
    console.log(e);
    return res.render("login", { loginType: "Email", msg: "Something went wrong" });
  }
};

function generateOTP() {
  const characters = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return otp;
}

const sendotp = async (req, res) => {
  var mail = req.body.email;
  if (!(await User.findOne({ email: mail }))) {
    return res.render("Forgot_pass", { msg: "No such user", newpass: "NO", otpsec: "NO", emailsec: "YES", title: "Forgot Password" });
  }
  var otp = generateOTP();
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: mail,
    subject: 'Your OTP Code',
    text: `Your OTP for resetting the password is: ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    storeOtp(mail, otp);
    return res.render("Forgot_pass", { msg: "OTP Sent successfully!!", otpsec: "YES", newpass: "NO", emailsec: "NO", title: "Forgot Password" });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ msg: "Failed to send OTP" });
  }
}

const verifyotp = async (req, res) => {
  const action = req.body.action;
  if (action === "verify") {
    getOtp(req.body.foremail)
      .then((otp) => {
        if (otp) {
          if (otp === req.body.otp) {
            return res.render("Forgot_pass", { msg: "OTP Verified", otpsec: "NO", newpass: "YES", emailsec: "NO", title: "Forgot Password" })
          }
          else {
            return res.render("Forgot_pass", { msg: "Invalid OTP", otpsec: "YES", newpass: "NO", emailsec: "NO", title: "Forgot Password" })
          }
        }
        else {
          return res.render("Forgot_pass", { msg: "No OTP Found", otpsec: "YES", newpass: "NO", emailsec: "NO", title: "Forgot Password" })
        }
      })
      .catch((err) => console.error("Error:", err));
  }
  else {
    const mail = req.body.foremail;
    const otp = generateOTP();
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: mail,
      subject: 'Your OTP Code',
      text: `Your OTP for resetting the password is: ${otp}`
    };

    try {
      await transporter.sendMail(mailOptions);
      storeOtp(mail, otp);
      return res.render("Forgot_pass", { msg: "OTP Sent successfully!!", otpsec: "YES", newpass: "NO", emailsec: "NO", title: "Forgot Password" });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ msg: "Failed to send OTP" });
    }
  }
};

const handlefpadmin = async (req, res) => {
  const otp2 = generateOTP();
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.adminEmail,
    subject: 'Your OTP Code',
    text: `Your OTP for resetting the password is: ${otp2}`
  };

  try {
    await transporter.sendMail(mailOptions);
    storeOtp(process.env.adminEmail, otp2);
    return res.render("fpadmin", { msg: "OTP Sent successfully!!" });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ msg: "Failed to send OTP" });
  }
}

const adminPassUpdate = (req, res) => {
  if (req.body.password === req.body.password1) {
    getOtp(process.env.adminEmail)
      .then((otp) => {
        if (otp) {
          if (otp === req.body.otp) {
            process.env.adminPass = req.body.password;
            return res.render("admin", { msg: "Password Updated Successfully" })
          }
          else {
            return res.render("fpadmin", { msg: "Invalid OTP" });
          }
        }
      })
  }
  else {
    return res.render("fpadmin", { msg: "Password Mismatched" });
  }
}

const updatepass = async (req, res) => {
  if (req.body.new_password != req.body.new_password2) {
    return res.render("Forgot_pass", { msg: "Password mismatch", otpsec: "NO", newpass: "YES", emailsec: "NO", title: "Forgot Password" })
  }
  else {
    const user = await User.findOne({
      email: req.body.foremail,
    })

    console.log(user, user.username);

    if (await bcrypt.compare(user.password, req.body.new_password)) {
      return res.render("Forgot_pass", { msg: "Same password as before", otpsec: "NO", newpass: "YES", emailsec: "NO", title: "Forgot Password" })
    }
    else {
      user.password = await bcrypt.hash(req.body.new_password, 10);
      await user.save();
      await ActivityLog.create({username: req.body.username, id: `#${Date.now()}`, message: "Your Password has been changed!!"});
      return res.render("login", { msg: "Password Updated!!", loginType: null });
    }
  }
};

const handlelogout = (req, res) => {
  res.cookie('uuid', '', { maxAge: 0 });
  return res.render("login", { loginType: null, msg: null });
}

const handleContact = (req, res) => {
  const data = {
    Name: req.body.name,
    Email: req.body.email,
    sub: req.body.subject,
    msg: req.body.message
  };
  const pat = path.resolve(`routes/Responses/${req.body.subject}/${req.body.email}.json`);
  fs.writeFile(pat, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.log("Error is writing file", err);
    }
    else {
      return res.render("contact", { img: data[2], msg: "Your response is noted, we'll get back to you soon." })
    }
  })
}

const handleadminlogin = async (req, res) => {
  if (req.body.username === process.env.adminUsername && req.body.password === process.env.adminPass) {
    const totalUsers = await User.find({}).sort({ createdAt: -1 });
    const totalPosts = await Post.find({});
    const tickets = await Report.find({}).lean();
    const orders = await Payment.find({}).lean();
    const reviews = await Feedback.find({});
    var revenue = 0;
    orders.forEach(order => {
      if (order.status !== "Pending") {
        revenue += Number(order.amount);
      }
    });
    return res.render("adminPortal", { total_revenue: revenue, total_users: totalUsers.length, total_posts: totalPosts.length, allUsersInOrder: totalUsers, total_tickets: tickets.length, allOrders: orders, allUsers: totalUsers, allReports: tickets, allReviews: reviews });
  }
  else {
    return res.render("admin", { msg: "Incorrect Credentials" });
  }
}

const fetchOverlayUser = async (req, res) => {
  const { user_id, username, email } = req.body;
  const user = await User.findOne({ username: username });
  return res.json(user);
}

const handlegetHome = async (req, res) => {
  const { data } = req.userDetails;
  const createdAt = req.query.createdAt || new Date();
  const posts = await Post.find({
    createdAt: { $lt: createdAt },
  }).sort({ createdAt: -1 }).limit(5);

  if (!posts) return res.status(404).json({ err: "Post not found" });

  return res.render("home", { img: data[2], currUser: data[0], posts });
}

const handlegetpayment = (req, res) => {
  const { data } = req.userDetails;
  return res.render("payment", { img: data[2], currUser: data[0] });
}

const handlegetprofile = async (req, res) => {
  const u = req.params;
  const { data } = req.userDetails;
  const profUser = await User.findOne({ username: u.username });
  if (!profUser) {
    return res.render("Error_page", { img: data[2], currUser: data[0], error_msg: "Profile Not Found!!" });
  }
  const postIds = profUser.postIds || [];
  const postObjects = await Post.find({ _id: { $in: postIds } });
  const savedIds = profUser.savedPostsIds || [];
  const savedObjects = await Post.find({ _id: { $in: savedIds } });
  const likeIds = profUser.likedPostsIds || [];
  const likedObjects = await Post.find({ _id: { $in: likeIds } });
  const archiveIds = profUser.archivedPostsIds || [];
  const archivedObjects = await Post.find({ _id: { $in: archiveIds } });
  const meUser = await User.findOne({ username: data[0] });
  const isFollowingThem = meUser.followings.some(f => f.username === u.username);
  const isFollowedByThem = meUser.followers.some(f => f.username === u.username);
  const isFriend = isFollowingThem && isFollowedByThem;
  const isFollower = isFollowedByThem && !isFollowingThem;
  const isRequested = isFollowingThem && !isFollowedByThem;
  if (u.username === data[0]) {
    return res.render("profile", { img: data[2], myUser: profUser, currUser: data[0], posts: postObjects, saved: savedObjects, liked: likedObjects, archived: archivedObjects, isFollower, isFriend, isRequested });
  }
  else {
    return res.render("profile_others", { img: data[2], myUser: profUser, currUser: data[0], posts: postObjects, saved: savedObjects, liked: likedObjects, archived: archivedObjects, isFollower, isFriend, isRequested });
  }
}

const handlegetterms = (req, res) => {
  const { data } = req.userDetails;
  return res.render("tandc", { img: data[2], currUser: data[0] });
}

const handlegetcontact = (req, res) => {
  const { data } = req.userDetails;
  return res.render("contact", { img: data[2], msg: null, currUser: data[0] });
}

const handlegetconnect = (req, res) => {
  const { data } = req.userDetails;
  return res.render("connect", { img: data[2], currUser: data[0] });
}

const handlegetgames = (req, res) => {
  const { data } = req.userDetails;
  return res.render("games", { img: data[2], currUser: data[0] });
}

const handlegetstories = (req, res) => {
  const { data } = req.userDetails;
  return res.render("stories", { img: data[2], currUser: data[0] });
}

const handlegetdelacc = (req, res) => {
  const { data } = req.userDetails;
  return res.render("delacc", { img: data[2], msg: null, currUser: data[0] });
}

const handlegetadmin = (req, res) => {
  return res.render("admin", { msg: null });
}

const handlegetreels = (req, res) => {
  const { data } = req.userDetails;
  return res.render("reels", { img: data[2], currUser: data[0] });
}

const handlegethelp = (req, res) => {
  const { data } = req.userDetails;
  return res.render("help", { img: data[2], currUser: data[0] });
}

const handlegetsignup = (req, res) => {
  return res.render("Registration", { msg: null });
}

const handlegetforgetpass = (req, res) => {
  res.render("Forgot_pass", { msg: null, newpass: "NO", otpsec: "NO", emailsec: "YES", title: "Forgot Password" });
}

const handlegeteditprofile = async (req, res) => {
  const { data } = req.userDetails;
  const user = await User.findOne({ username: data[0] });
  return res.render("edit_profile", { img: data[2], currUser: data[0], CurrentUser: user });
}

const updateUserProfile = async (req, res) => {
  const { data } = req.userDetails;
  const { photo, profileImageUrl, display_name, name, bio, gender, phone, terms } = req.body;
  await User.findOneAndUpdate(
    { username: data[0] },
    { $set: { display_name: display_name, fullName: name, bio: bio, gender: gender, phone: phone } }
  )
  if (photo !== "") {
    await User.findOneAndUpdate({ username: data[0] }, { profilePicture: profileImageUrl });
  }

  const token = create_JWTtoken([data[0], data[1], (photo !== "") ? profileImageUrl : data[2], data[3]], process.env.USER_SECRET, '30d');
  res.cookie('uuid', token, { httpOnly: true });
  return res.redirect(`/profile/${data[0]}`);
}

const handlegetpostoverlay = (req, res) => {
  return res.render("post_overlay");
}

const handlegetcreatepost = (req, res) => {
  const { data } = req.userDetails;
  return res.render("create_post", { img: data[2], currUser: data[0] });
}

const handlecreatepost = (req, res) => {
  const image = req.body.profileImageUrl;
  const { data } = req.userDetails;
  return res.render("create_post_second", { img2: image, img: data[2], currUser: data[0] });
}

const handlegetcreatepost2 = (req, res) => {
  const { data } = req.userDetails
  return res.render("create_post_second", { img2: 'https://ik.imagekit.io/FFSD0037/esrpic-609a6f96bb3031_OvyeHGHcB.jpg?updatedAt=1744145583878', currUser: data[0], img: data[2] });
}

const followSomeone = async (req, res) => {
  const { data } = req.userDetails;
  const { username } = req.params;
  try {
    await User.findOneAndUpdate(
      { username: data[0] },
      {
        $addToSet: {
          followings: {
            username: username
          }
        }
      }
    )
    await User.findOneAndUpdate(
      { username: username },
      {
        $addToSet: {
          followers: {
            username: data[0]
          }
        }
      }
    )
    return res.json({ success: true, message: null });
  }
  catch (err) {
    console.log(err);
  }
}

const unfollowSomeone = async (req, res) => {
  const { data } = req.userDetails;
  const { username } = req.params;
  try {
    await User.findOneAndUpdate(
      { username: data[0] },
      { $pull: { followings: { username: username } } },
      { new: true }
    )
    await User.findOneAndUpdate(
      { username: username },
      { $pull: { followers: { username: data[0] } } },
      { new: true }
    )
    return res.json({ success: true, message: null });
  }
  catch (err) {
    console.log(err);
    return res.json({ success: false, message: "not succeeded" });
  }
}

const handlegetnotification = (req, res) => {
  const { data } = req.userDetails;
  const allNotifications = Notification.find({}).lean();
  return res.render("notifications", { img: data[2], currUser: data[0], allNotifications })
}

const getSearch = async (req, res) => {
  const { data } = req.userDetails;
  const { username } = req.params;console.log(username);
  
  let users = await User.find({
    username: { $regex: username, $options: "i" }
  }).limit(10);

  if(users.length < 5)
    users.push(...await User.find({
      display_name: { $regex: username, $options: "i" }
    }).limit(5-users.length));
  
  if(users.length){
    users = users.filter(user => user.username !== data[0]);
    users=users.map(user => ({
      username:user.username,
      avatarUrl:user.profilePicture,
      display_name:user.display_name,
      followers:user.followers.length,
      following:user.followings.length
    }));
  }
  
  return res.render("search", { img: data[2], currUser: data[0], users });
}

export {
  handleSignup,
  handleLogin,
  sendotp,
  verifyotp,
  updatepass,
  handleContact,
  handledelacc,
  handlelogout,
  handlegetHome,
  handlegetpayment,
  handlegetprofile,
  handlegetterms,
  handlegetcontact,
  handlegetconnect,
  handlegetforgetpass,
  handlegetsignup,
  handlegethelp,
  handlegetreels,
  handlegetdelacc,
  handlegetstories,
  handlegetgames,
  handlegetadmin,
  handleadminlogin,
  generateOTP,
  handlefpadmin,
  adminPassUpdate,
  handlegeteditprofile,
  handlegetpostoverlay,
  handlegetcreatepost,
  handlecreatepost,
  handlegetcreatepost2,
  updateUserProfile,
  fetchOverlayUser,
  followSomeone,
  unfollowSomeone,
  handlegetnotification,
  getSearch
};