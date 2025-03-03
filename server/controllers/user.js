import file from "fs";
import path from "path";
import { Username, Email } from "../routes/Fns.js";

const handleSignup = (req, res) => {
  const contents = `{
      "fullName": "${req.body.fullName}",
      "username": "${req.body.username}",
      "email": "${req.body.email}",
      "phone": "${req.body.phone}",
      "password": "${req.body.password}", 
      "dob": "${req.body.dob}",
      "profilePicture": "${req.file ? req.file.filename : ""}",
      "bio": "${req.body.bio || ""}",
      "gender": "${req.body.gender}",
      "termsAccepted": ${req.body.terms ? true : false}
    }`;

  const pat = path.resolve(`routes/Users/${req.body.username}.json`);

  Username(req.body.username, (err, data) => {
    if (err) {
      console.log("ERROR: ", err);
      return res.status(500).render("Registration", { msg: "Internal Server Error" });
    }

    if (data) {
      return res.render("Registration", { msg: "Username already taken" });
    }

    Email(req.body.email, (err2, data2) => {
      if (err2) {
        console.log("ERROR: ", err2);
        return res.status(500).render("Registration", { msg: "Internal Server Error" });
      }

      if (data2) {
        return res.render("Registration", { msg: "Email already taken" });
      }

      file.writeFile(pat, contents, (err) => {
        if (err) {
          console.log("ERROR: ", err);
          return res.status(500).render("Registration", { msg: "Internal Server Error" });
        }

        console.log("File written successfully!!");
        res.status(200).render("Registration", { msg: "User registered successfully!" });
      });

      file.writeFile(path.resolve(`routes/usernames.txt`), req.body.username, (err) => {
        if (err) {
          console.log("ERROR: ", err);
        }
      });

      file.writeFile(path.resolve(`routes/Emails.txt`), req.body.email, (err) => {
        if (err) {
          console.log("ERROR: ", err);
        }
      });
    });
  });
};

export { handleSignup };