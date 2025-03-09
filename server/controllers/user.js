import file from "fs";
import path from "path";
import { Username, Email } from "../routes/Fns.js";
import { create_JWTtoken } from "cookie-string-parser";

const handleSignup = (req, res) => {
  // Get profile picture URL from the hidden field or use empty string as default
  const profilePictureUrl = req.body.profileImageUrl || "";
  console.log(profilePictureUrl);
  
  const contents = `{
      "fullName": "${req.body.fullName}",
      "username": "${req.body.username}",
      "email": "${req.body.email}",
      "phone": "${req.body.phone}",
      "password": "${req.body.password}", 
      "dob": "${req.body.dob}",
      "profilePicture": "${profilePictureUrl}",
      "bio": "${req.body.bio || ""}",
      "gender": "${req.body.gender}",
      "termsAccepted": ${req.body.terms ? false : true}
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
        
        // Create JWT token after successful file write
        // const token = create_JWTtoken([req.body.username, req.body.email], 'secret', "60d");
        
        // // Set cookie
        // res.cookie('useruid', token, {
        //   httpOnly: true,
        //   secure: true,
        //   sameSite: 'none',
        //   maxAge: 1000*60*60*24*60
        // });

        // Return success response
        return res.status(201).send('account created');
      });

      file.appendFile(path.resolve(`routes/usernames.txt`), req.body.username, (err) => {
        if (err) {
          console.log("ERROR: ", err);
        }
      });

      file.append(path.resolve(`routes/Emails.txt`), req.body.email, (err) => {
        if (err) {
          console.log("ERROR: ", err);
        }
      });
    });
  });
};

export { handleSignup };