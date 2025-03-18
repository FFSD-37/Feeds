import express from "express";
import { handleSignup, handleLogin, sendotp, verifyotp, updatepass, handleContact } from "../controllers/user.js";
import { handleimagKitauth } from "../services/imagKit.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("login", { loginType: null, msg: null });
});

router.get("/home", (req, res) => {
  return res.render("home", {img: process.env.CURR_USER_IMG })
});

router.get("/payment", (req, res) => {
  return res.render("payment", {img: process.env.CURR_USER_IMG});
});

router.get("/tandc", (req, res) => {
  return res.render("tandc", {img: process.env.CURR_USER_IMG});
});

router.get("/contact", (req, res) => {
  return res.render("contact", {img: process.env.CURR_USER_IMG, msg: null});
});

router.get("/connect", (req, res) => {
  return res.render("connect", {img: process.env.CURR_USER_IMG})
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

router.post("/contact", handleContact);

router.get("/forget-password", (req, res) => {
  res.render("Forgot_pass", { msg: null, newpass: "NO", otpsec: "NO", emailsec: "YES", title: "Forgot Password" });
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