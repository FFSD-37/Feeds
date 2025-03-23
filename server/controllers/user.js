import nodemailer from 'nodemailer';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';
import { create_JWTtoken } from 'cookie-string-parser';

const dbPromise = open({
  filename: './controllers/imdb.sqlite',
  driver: sqlite3.Database
});

async function setupDatabase() {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS otps (
      email TEXT PRIMARY KEY,
      otp TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("✅ Database & table setup complete!");
}

setupDatabase().catch(console.error);

async function storeOtp(email, otp) {
  const db = await dbPromise;
  await db.run(
    `INSERT INTO otps (email, otp) VALUES (?, ?)
    ON CONFLICT(email) DO UPDATE SET otp = excluded.otp, created_at = CURRENT_TIMESTAMP`,
    [email, otp]
  );
  console.log(`✅ OTP for ${email} saved successfully.`);
}

async function getOtp(email) {
  const db = await dbPromise;
  const row = await db.get(`SELECT otp FROM otps WHERE email = ?`, [email]);
  return row ? row.otp : null;
}

let users = [
  {
    fullname: "Gourav Khakse",
    username: "VoyagerX21",
    email: "khakse2gaurav2003@gmail.com",
    phone: '8527054595',
    password: "Khakse@123",
    dob: "2003-05-21",
    profilePicture: "https://ik.imagekit.io/FFSD0037/WIN_20241229_22_47_54_Pro_1ajcB2M9r.jpg?updatedAt=1741976412981",
    bio: "live once live fully",
    gender: "male",
    termsAccepted: true
  },
  {
    fullname: "Ayush",
    username: "bloomBoy",
    email: "2357ayush@gmail.com",
    phone: '9043125698',
    password: "yush@123",
    dob: "2005-09-20",
    profilePicture: "https://ik.imagekit.io/FFSD0037/FB_IMG_1694627814088_hFyTN6nXw.jpg?updatedAt=1741777451291",
    bio: "keep smiling",
    gender: "male",
    termsAccepted: true
  },
  {
    fullName: 'Atin Chowdhury',
    username: 'AtinUser',
    email: 'atin@gmail.com',
    phone: '8574961256',
    password: 'atin@123',
    dob: '2003-10-31',
    profilePicture: 'https://ik.imagekit.io/FFSD0037/OHR.EuropaMoon_EN-IN7952428847_UHD_3840_2160_Su1-MPj5k.jpg',
    bio: 'god is everything',
    gender: 'male',
    termsAccepted: true
  }
];

let usernames = ['VoyagerX21', 'bloomBoy', 'AtinUser'];
let emails = ['khakse2gaurav2003@gmail.com', '2357ayush@gmail.com', 'atin@gmail.com'];
let curr;

const handleSignup = (req, res) => {
  const userData = {
    fullName: req.body.fullName,
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    dob: req.body.dob,
    profilePicture: req.body.profileImageUrl ? req.body.profileImageUrl : process.env.DEFAULT_USER_IMG,
    bio: req.body.bio || "",
    gender: req.body.gender,
    termsAccepted: !req.body.terms
  };
  const uname = req.body.username;
  const em = req.body.email;
  if (usernames.includes(uname)) {
    return res.render("Registration", { msg: "Username already taken" });
  }
  else {
    if (emails.includes(em)) {
      return res.render("Registration", { msg: "Email already taken" });
    }
    else {
      users.push(userData);
      usernames.push(uname);
      emails.push(em);
      const token = create_JWTtoken([userData.username,userData.email,userData.profilePicture],process.env.USER_SECRET,'30d');
      res.cookie('uuid',token,{httpOnly:true});
      return res.redirect("/home");
    }
  }
};

const handledelacc = (req, res) => {
  if (users[curr].password === req.body.password) {
    usernames = usernames.filter(u => u != users[curr].username);
    emails = emails.filter(e => e != users[curr].email);
    users.splice(curr, 1);
    curr = undefined;
    return res.render("login", { loginType: "Email", msg: "User Deleted Successfully" });
  }
  else {
    return res.render("delacc", { img: data[2], msg: "Incorrect Password!!" });
  }
}

const handleLogin = (req, res) => {
  if (req.body.identifykro == 'username') {
    const idx = usernames.indexOf(req.body.identifier);
    if (idx == -1) {
      return res.render("login", { loginType: "Email", msg: "Username Doesn't exists" });
    }
    if (users[idx].password !== req.body.password) {
      return res.render("login", { loginType: "Username", msg: "Incorrect password" });
    }
    curr = idx;
    const token = create_JWTtoken([users[idx].username,users[idx].email,users[idx].profilePicture],process.env.USER_SECRET,'30d');
    res.cookie('uuid',token,{httpOnly:true});
    return res.render("home", { img: users[idx].profilePicture });
  }
  else {
    const idx = emails.indexOf(req.body.identifier);
    if (idx == -1) {
      return res.render("login", { loginType: "Username", msg: "Email not registered" });
    }
    if (users[idx].password != req.body.password) {
      return res.render("login", { loginType: "Email", msg: "Incorrect password" });
    }
    curr = idx;
    const token = create_JWTtoken([users[idx].username,users[idx].email,users[idx].profilePicture],process.env.USER_SECRET,'30d');
    res.cookie('uuid',token,{httpOnly:true});
    return res.render("home", { img: users[idx].profilePicture });
  }
};

function generateOTP() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return otp;
}

const sendotp = async (req, res) => {
  var mail = req.body.email;
  if (!(emails.includes(mail))) {
    return res.render("Forgot_pass", { msg: "Email not Registered", newpass: "NO", otpsec: "NO", emailsec: "YES", title: "Forgot Password" });
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
            return res.render("admin", {msg: "Password Updated Successfully"})
          }
          else {
            return res.render("fpadmin", {msg: "Invalid OTP"});
          }
        }
      })
  }
  else {
    return res.render("fpadmin", { msg: "Password Mismatched" });
  }
}

const updatepass = (req, res) => {
  if (req.body.new_password != req.body.new_password2) {
    return res.render("Forgot_pass", { msg: "Password mismatch", otpsec: "NO", newpass: "YES", emailsec: "NO", title: "Forgot Password" })
  }
  else {
    const user = users[emails.indexOf(req.body.foremail)];
    if (user.password == req.body.new_password) {
      return res.render("Forgot_pass", { msg: "Same password as before", otpsec: "NO", newpass: "YES", emailsec: "NO", title: "Forgot Password" })
    }
    else {
      user.password = req.body.new_password;
      return res.render("login", { msg: "Password Updated!!", loginType: null });
    }
  }
};

const handlelogout = (req, res) => {
  curr = undefined;
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

const handleadminlogin = (req, res) => {
  if (req.body.username === process.env.adminUsername && req.body.password === process.env.adminPass) {
    return res.render("adminPortal");
  }
  else {
    return res.render("admin", { msg: "Incorrect Credentials" });
  }
}

const handlegetHome = (req, res) => {
  const {data}=req.userDetails;
  
    return res.render("home", { img:data[2]});
}

const handlegetpayment = (req, res) => {
  const {data}=req.userDetails;
    return res.render("payment", { img: data[2] });
}

const handlegetprofile = (req, res) => {
    const {data}=req.userDetails;
    return res.render("profile", { img: data[2] });
}

const handlegetterms = (req, res) => {
    const {data}=req.userDetails;
    return res.render("tandc", { img: data[2] });
}

const handlegetcontact = (req, res) => {
    const {data}=req.userDetails;
    return res.render("contact", { img: data[2], msg: null });
}

const handlegetconnect = (req, res) => {
    const {data}=req.userDetails;
    return res.render("connect", { img: data[2] });
}

const handlegetgames = (req, res) => {
    const {data}=req.userDetails;
    return res.render("games", { img: data[2] });
}

const handlegetstories = (req, res) => {
    const {data}=req.userDetails;
    return res.render("stories", { img: data[2] });
}

const handlegetdelacc = (req, res) => {
    const {data}=req.userDetails;
    return res.render("delacc", { img: data[2], msg: null });
}

const handlegetadmin = (req, res) => {
  curr = undefined;
  return res.render("admin", { msg: null });
}

const handlegetreels = (req, res) => {
    const {data}=req.userDetails;
    return res.render("reels", { img: data[2] });
}

const handlegethelp = (req, res) => {
    const {data}=req.userDetails;
    return res.render("help", { img: data[2] });
}

const handlegetsignup = (req, res) => {
  return res.render("Registration", { msg: null });
}

const handlegetforgetpass = (req, res) => {
  res.render("Forgot_pass", { msg: null, newpass: "NO", otpsec: "NO", emailsec: "YES", title: "Forgot Password" });
}

export { handleSignup, handleLogin, sendotp, verifyotp, updatepass, handleContact, handledelacc, handlelogout, handlegetHome, handlegetpayment, handlegetprofile, handlegetterms, handlegetcontact, handlegetconnect, handlegetforgetpass, handlegetsignup, handlegethelp, handlegetreels, handlegetdelacc, handlegetstories, handlegetgames, handlegetadmin, handleadminlogin, generateOTP, handlefpadmin, adminPassUpdate };