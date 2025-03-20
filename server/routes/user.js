import express from "express";
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
} from "../controllers/user.js";
import { handleimagKitauth } from "../services/imagKit.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("login", { loginType: null, msg: null });
});

router.get("/home", handlegetHome);

router.get("/payment", handlegetpayment);

router.get("/profile", handlegetprofile);

router.get("/tandc", handlegetterms);

router.get("/contact", handlegetcontact);

router.get("/connect", handlegetconnect);

router.get("/games", handlegetgames);

router.get("/stories", handlegetstories);

router.get("/delacc", handlegetdelacc);

router.get("/reels", handlegetreels);

router.get("/help", handlegethelp);

router.get("/login", (req, res) => {
  res.render("login", {
    loginType: null,
    msg: null,
  });
});

router.get("/signup", handlegetsignup);

router.post("/login", handleLogin);

router.post("/signup", handleSignup);

router.post("/contact", handleContact);

router.post("/delacc", handledelacc);

router.get("/forget-password", handlegetforgetpass);

router.post("/logout", handlelogout);

router.post("/sendotp", sendotp);

router.post("/verifyotp", verifyotp);

router.post("/updatepass", updatepass);

router.get("/imagKitauth", handleimagKitauth);

export default router;