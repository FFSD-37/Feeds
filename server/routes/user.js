import express from "express";
import file from 'fs';
import { handleSignup, handleLogin, sendotp, verifyotp, updatepass } from "../controllers/user.js";
import { handleimagKitauth } from "../services/imagKit.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("login", { loginType: null, msg: null });
});

router.get("/home", (req, res) => {
  return res.render("home", {img: "https://ik.imagekit.io/FFSD0037/esrpic-609a6f96bb3031_b8m7MLivq2.jpg" })
});

router.get("/payment", (req, res) => {
  return res.render("payment");
})

router.get("/games", (req, res) => {
  return res.render("games");
})

router.get("/help", (req, res) => {
  return res.render("help", {img: process.env.CURR_USER_IMG});
});

router.get("/login", (req, res) => {
  res.render("login", {
    loginType: null,
    msg: null,
  });
});

router.get("/signup", (req, res) => {
  res.render("Registration", { msg: null });
});

router.post("/login", handleLogin);

router.post("/signup", handleSignup);

router.get("/forget-password", (req, res) => {
  res.render("Forgot_pass", { msg: null, newpass: "NO", otpsec: "NO", emailsec: "YES" });
});

router.post("/logout", (req, res) => {
  process.env.CURR_USER_IMG = '';
  return res.render("login", { loginType: null, msg: null });
})

router.post("/sendotp", sendotp);

router.post("/verifyotp", verifyotp);

router.post("/updatepass", updatepass);

router.get('/imagKitauth', handleimagKitauth);

export default router;