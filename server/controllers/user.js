import nodemailer from 'nodemailer';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

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
    "fullname": "Gourav Khakse",
    "username": "VoyagerX21",
    "email": "khakse2gaurav2003@gmail.com",
    "phone": '8527054595',
    "password": "Khakse@123",
    "dob": "2003-05-21",
    "profilePicture": "https://ik.imagekit.io/FFSD0037/WIN_20241229_22_47_54_Pro_1ajcB2M9r.jpg?updatedAt=1741976412981",
    "bio": "live once live fully",
    "gender": "male",
    "termsAccepted": true
  },
  {
    "fullname": "Ayush",
    "username": "bloomBoy",
    "email": "2357ayush@gmail.com",
    "phone": '9043125698',
    "password": "yush@123",
    "dob": "2005-09-20",
    "profilePicture": "https://ik.imagekit.io/FFSD0037/FB_IMG_1694627814088_hFyTN6nXw.jpg?updatedAt=1741777451291",
    "bio": "keep smiling",
    "gender": "male",
    "termsAccepted": true
  },
  {
    "fullName": 'Atin Chowdhury',
    "username": 'AtinUser',
    "email": 'atin@gmail.com',
    "phone": '8574961256',
    "password": 'atin@123',
    "dob": '2003-10-31',
    "profilePicture": 'https://ik.imagekit.io/FFSD0037/OHR.EuropaMoon_EN-IN7952428847_UHD_3840_2160_Su1-MPj5k.jpg',
    "bio": 'god is everything',
    "gender": 'male',
    "termsAccepted": true
  }
];
let usernames = ['VoyagerX21', 'bloomBoy','AtinUser'];
let emails = ['khakse2gaurav2003@gmail.com', '2357ayush@gmail.com','atin@gmail.com'];

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
      return res.render("login", { loginType: 'Email', msg: "Registered Successfully!!" });
    }
  }
};

const handleLogin = (req, res) => {
  if (req.body.identifykro == 'username') {
    const idx = usernames.indexOf(req.body.identifier);
    if (idx == -1) {
      return res.render("login", { loginType: "Email", msg: "Username Doesn't exists" });
    }
    if (users[idx].password !== req.body.password) {
      return res.render("login", { loginType: "Username", msg: "Incorrect password" });
    }
    process.env.CURR_USER_IMG = users[idx].profilePicture;
    return res.render("home", { img: process.env.CURR_USER_IMG });
  }
  else {
    const idx = emails.indexOf(req.body.identifier);
    if (idx == -1) {
      return res.render("login", { loginType: "Username", msg: "Email not registered" });
    }
    if (users[idx].password != req.body.password) {
      return res.render("login", { loginType: "Email", msg: "Incorrect password" });
    }
    process.env.CURR_USER_IMG = users[idx].profilePicture;
    return res.render("home", { img: process.env.CURR_USER_IMG });
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
          if (otp == req.body.otp) {
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
    console.log(req.body);
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

export { handleSignup, handleLogin, sendotp, verifyotp, updatepass };