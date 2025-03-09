import file from "fs";
import path from "path";
import { Username, Email } from "../routes/Fns.js";
// import { create_JWTtoken } from "cookie-string-parser"; // Uncomment when needed

const handleSignup = (req, res) => {
  const userData = {
    fullName: req.body.fullName,
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    dob: req.body.dob,
    profilePicture: req.body.profileImageUrl,
    bio: req.body.bio || "",
    gender: req.body.gender,
    termsAccepted: !!req.body.terms, // Converts to boolean
  };

  const uname = req.body.username;
  const mail = req.body.email;
  const userFilePath = path.resolve(`routes/Users/${uname}.json`);
  const relFilePath = path.resolve(`routes/Users/rel.json`);
  const usernamesPath = path.resolve(`routes/usernames.txt`);
  const emailsPath = path.resolve(`routes/Emails.txt`);

  // Check if username already exists
  Username(uname, (err, data) => {
    if (err) {
      console.error("ERROR:", err);
      return res.status(500).render("Registration", { msg: "Internal Server Error" });
    }
    if (data) {
      return res.render("Registration", { msg: "Username already taken" });
    }

    // Check if email already exists
    Email(mail, (err2, data2) => {
      if (err2) {
        console.error("ERROR:", err2);
        return res.status(500).render("Registration", { msg: "Internal Server Error" });
      }
      if (data2) {
        return res.render("Registration", { msg: "Email already taken" });
      }

      // Step 1: Write user JSON file
      file.writeFile(userFilePath, JSON.stringify(userData, null, 2), (err) => {
        if (err) {
          console.error("ERROR:", err);
          return res.status(500).render("Registration", { msg: "Internal Server Error" });
        }
        console.log("User file written successfully!");

        // Step 2: Append username and email to respective files
        file.appendFile(usernamesPath, uname + "\n", (err) => {
          if (err) console.error("ERROR:", err);
        });
        file.appendFile(emailsPath, mail + "\n", (err) => {
          if (err) console.error("ERROR:", err);
        });

        // Step 3: Update email-to-username mapping in rel.json
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

            return res.status(200).render("Login", { loginType: null, msg: "Registered Successfully!!" });
          });
        });
      });
    });
  });
};

const handleLogin = (req, res) => {
  console.log(req.body);
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
          return res.render("home");
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
      file.readFile(path.resolve(`routes/Users/rel.json`), 'utf8', (err, data) => {
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
            return res.render("home");
          }
          else {
            return res.render("login", { loginType: null, msg: "Invalid password!!" });
          }
        });
      });
    });
  }
};

export { handleSignup, handleLogin };
