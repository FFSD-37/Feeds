import express from "express";
import { handleSignup, handleLogin, sendotp, verifyotp, updatepass } from "../controllers/user.js";
import { handleimagKitauth } from "../services/imagKit.js";
// import externals from './Fns.js';

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login", {
    loginType: null,
    msg: null,
  });
});

router.get("/signup", (req, res) => {
  res.render("Registration", {msg: ""});
});

router.post("/login", handleLogin);

router.post("/signup", handleSignup);

router.get("/forget-password", (req, res) => {
  res.render("Forgot_pass", {msg: null, newpass: "NO", otpsec: "NO", emailsec: "YES"});
});

router.post("/sendotp", sendotp);

router.post("/verifyotp", verifyotp);

router.post("/updatepass", updatepass);

router.get('/imagKitauth',handleimagKitauth);

export default router;