import express from "express";
import nodemailer from 'nodemailer';
import {
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
  handlegetgames,
  handlegetstories,
  handlegetdelacc,
  handlegetreels,
  handlegethelp,
  handlegetsignup,
  handlegetforgetpass,
  handlegetadmin,
  handleadminlogin,
  handlefpadmin,
  adminPassUpdate
} from "../controllers/user.js";
import { handleimagKitauth } from "../services/imagKit.js";
import { isAuthuser } from "../middleware/isAuthuser.js";

const router = express.Router();

router.get("/",isAuthuser, (req, res) => {
  res.render("login", { loginType: null, msg: null });
});

router.get("/home",isAuthuser, handlegetHome);

router.get("/payment",isAuthuser, handlegetpayment);

router.get("/profile",isAuthuser, handlegetprofile);

router.get("/tandc",isAuthuser, handlegetterms);

router.get("/contact",isAuthuser, handlegetcontact);

router.get("/connect",isAuthuser, handlegetconnect);

router.get("/games",isAuthuser, handlegetgames);

router.get("/stories",isAuthuser, handlegetstories);

router.get("/delacc",isAuthuser, handlegetdelacc);

router.get("/reels",isAuthuser, handlegetreels);

router.get("/help",isAuthuser, handlegethelp);

router.get("/login",isAuthuser, (req, res) => {
  res.render("login", {
    loginType: null,
    msg: null,
  });
});

router.get("/admin",isAuthuser, handlegetadmin);

router.get("/signup",isAuthuser, handlegetsignup);

router.post("/login", handleLogin);

router.post("/signup", handleSignup);

router.post("/contact", handleContact);

router.post("/adminLogin", handleadminlogin);

router.post("/delacc", handledelacc);

router.get("/forget-password", handlegetforgetpass);

router.post("/logout", handlelogout);

router.post("/sendotp", sendotp);

router.post("/verifyotp", verifyotp);

router.post("/updatepass", updatepass);

router.get("/imagKitauth", handleimagKitauth);

router.get("/fpadmin", handlefpadmin);

router.post("/updatepassadmin", adminPassUpdate);

export default router;