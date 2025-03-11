import file from "fs";
import path from "path";
import nodemailer from 'nodemailer';
import { Username, Email } from "../routes/Fns.js";
import { runInNewContext } from "vm";
// import { create_JWTtoken } from "cookie-string-parser"; // Uncomment when needed

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
  const mail = req.body.email;
  const userFilePath = path.resolve(`routes/Users/${uname}.json`);
  const relFilePath = path.resolve(`routes/rel.json`);
  const usernamesPath = path.resolve(`routes/usernames.txt`);
  const emailsPath = path.resolve(`routes/Emails.txt`);

  Username(uname, (err, data) => {
    if (err) {
      console.error("ERROR:", err);
      return res.status(500).render("Registration", { msg: "Internal Server Error" });
    }
    if (data) {
      return res.render("Registration", { msg: "Username already taken" });
    }

    Email(mail, (err2, data2) => {
      if (err2) {
        console.error("ERROR:", err2);
        return res.status(500).render("Registration", { msg: "Internal Server Error" });
      }
      if (data2) {
        return res.render("Registration", { msg: "Email already taken" });
      }

      file.writeFile(userFilePath, JSON.stringify(userData, null, 2), (err) => {
        if (err) {
          console.error("ERROR:", err);
          return res.status(500).render("Registration", { msg: "Internal Server Error" });
        }
        console.log("User file written successfully!");

        file.appendFile(usernamesPath, uname + "\n", (err) => {
          if (err) console.error("ERROR:", err);
        });
        file.appendFile(emailsPath, mail + "\n", (err) => {
          if (err) console.error("ERROR:", err);
        });

        file.readFile(relFilePath, "utf8", (err, data) => {
          let jsonData = {};

          if (!err && data) {
            try {
              jsonData = JSON.parse(data);
            } catch (parseErr) {
              console.error("ERROR: Corrupt JSON, resetting.");
              jsonData = {};
            }
          }

          jsonData[mail] = uname;

          file.writeFile(relFilePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
              return res.status(500).json({ error: "Error saving data" });
            }
            console.log("Updated rel.json successfully!");

            return res.render("login", { loginType: null, msg: "Registered Successfully!!" });
          });
        });
      });
    });
  });
};

const handleLogin = (req, res) => {
  if (req.body.identifykro == 'username') {
    Username(req.body.identifier, (err, data) => {
      if (err) {
        console.error("ERROR:", err);
        return res.status(500).render("Registration", { msg: "Internal Server Error" });
      }
      if (!data) {
        return res.render("login", { loginType: "Email", msg: "Username Doesn't exists" });
      }
      const patt = path.resolve(`routes/Users/${req.body.identifier}.json`);
      file.readFile(patt, 'utf8', (err, data) => {
        let jsonData = {};
        if (!err && data) {
          jsonData = JSON.parse(data);
        }
        if (jsonData['password'] === req.body.password) {
          process.env.CURR_USER_IMG = jsonData['profilePicture'];
          return res.render("home", { img: jsonData['profilePicture'] });
        }
        else {
          return res.render("login", { loginType: null, msg: "Invalid Username or password!!" });
        }
      })
    });
  }
  else {
    Email(req.body.identifier, (err2, data2) => {
      if (err2) {
        console.error("ERROR:", err2);
        return res.status(500).render("Registration", { msg: "Internal Server Error" });
      }
      if (!data2) {
        return res.render("login", { loginType: "Username", msg: "Email not registered" });
      }
      file.readFile(path.resolve(`routes/rel.json`), 'utf8', (err, data) => {
        let jsonData = {};
        if (!err && data) {
          jsonData = JSON.parse(data);
        }
        var unamee = jsonData[req.body.identifier];
        file.readFile(path.resolve(`routes/Users/${unamee}.json`), 'utf8', (err, data) => {
          let jsonData = {};
          if (!err && data) {
            jsonData = JSON.parse(data);
          }
          if (jsonData.password === req.body.password) {
            process.env.CURR_USER_IMG = jsonData['profilePicture'];
            return res.render("home", { img: jsonData['profilePicture'] });
          }
          else {
            return res.render("login", { loginType: null, msg: "Invalid password!!" });
          }
        });
      });
    });
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
  Email(mail, async (err2, data2) => {
    if (err2) {
      console.error("ERROR:", err2);
      return res.status(500).render("Forgot_pass", { msg: "Internal Server Error" });
    }

    if (!data2) {
      return res.render("Forgot_pass", { msg: "Email not registered" });
    }

    var otp = generateOTP();

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
      file.readFile(path.resolve(`controllers/otps.json`), 'utf8', (err, data) => {
        let jsonData = {};
        if (!err && data) {
          jsonData = JSON.parse(data);
        }
        jsonData[mail] = otp;
        file.writeFile(path.resolve(`controllers/otps.json`), JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
          if (writeErr) {
            console.error('Error writing to file:', writeErr);
          } else {
            console.log(`OTP for ${mail} saved successfully.`);
          }
        });
      })
      return res.render("Forgot_pass", { msg: "OTP Sent successfully!!", otpsec: "YES", newpass: "NO", emailsec: "NO" });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ msg: "Failed to send OTP" });
    }
  });
};

const verifyotp = async (req, res) => {
  const action = req.body.action;
  if (action == "verify") {
    file.readFile(path.resolve(`controllers/otps.json`), 'utf8', (err, data) => {
      let jsonData = {};
      if (!err && data) {
        jsonData = JSON.parse(data);
      }
      if (jsonData[req.body.foremail] == req.body.otp) {
        return res.render("Forgot_pass", { msg: "OTP Verified", otpsec: "NO", newpass: "YES", emailsec: "NO" })
      }
      else {
        return res.render("Forgot_pass", { msg: "Invalid OTP", otpsec: "YES", newpass: "NO", emailsec: "NO" })
      }
    });
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
      file.readFile(path.resolve(`controllers/otps.json`), 'utf8', (err, data) => {
        let jsonData = {};
        if (!err && data) {
          jsonData = JSON.parse(data);
        }
        jsonData[mail] = otp;
        file.writeFile(path.resolve(`controllers/otps.json`), JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
          if (writeErr) {
            console.error('Error writing to file:', writeErr);
          } else {
            console.log(`OTP for ${mail} saved successfully.`);
          }
        });
      })
      return res.render("Forgot_pass", { msg: "OTP Sent successfully!!", otpsec: "YES", newpass: "NO", emailsec: "NO" });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ msg: "Failed to send OTP" });
    }
  }
};

const updatepass = (req, res) => {
  if (req.body.new_password != req.body.new_password2) {
    return res.render("Forgot_pass", { msg: "Password mismatch", otpsec: "NO", newpass: "YES", emailsec: "NO" })
  }
  else {
    file.readFile(path.resolve(`routes/rel.json`), 'utf8', (err, data) => {
      let jsonData = {};
      if (!err && data) {
        jsonData = JSON.parse(data);
      }
      var unamee = jsonData[req.body.foremail];
      file.readFile(path.resolve(`routes/Users/${unamee}.json`), 'utf8', (err, data) => {
        let jsonData2 = {};
        if (!err && data) {
          jsonData2 = JSON.parse(data);
        }
        if (jsonData2.password == req.body.new_password) {
          return res.render("Forgot_pass", { msg: "Same password as before", otpsec: "NO", newpass: "YES", emailsec: "NO" })
        }
        jsonData2.password = req.body.new_password;
        file.writeFile(path.resolve(`routes/Users/${unamee}.json`), JSON.stringify(jsonData2, null, 2), 'utf8', (writeErr) => {
          if (writeErr) {
            console.error('Error writing to file:', writeErr);
          } else {
            console.log(`password updated`);
          }
        });
      });
      file.readFile(path.resolve(`controllers/otps.json`), 'utf8', (err, data) => {
        let jsonData = {};
        if (!err && data) {
          jsonData = JSON.parse(data);
        }
        jsonData[req.body.foremail] = '';
        file.writeFile(path.resolve(`controllers/otps.json`), JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
          if (writeErr) {
            console.error('Error writing to file:', writeErr);
          } else {
            console.log(`OTP erased successfully!!`);
          }
        });
      });
    });
    return res.render("login", { msg: "Password Updated!!", loginType: null });
  }
};

export { handleSignup, handleLogin, sendotp, verifyotp, updatepass };
