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
  handlegetadmin,
  handleadminlogin,
  handlefpadmin,
  adminPassUpdate,
  handlegeteditprofile,
  handlegetpostoverlay,
  handlegetcreatepost,
  handlecreatepost,
  handlegetcreatepost2
} from "../controllers/user.js";
import { handleimagKitauth } from "../services/imagKit.js";
import { isAuthuser } from "../middleware/isAuthuser.js";

const router = express.Router();

router.get("/",isAuthuser, (req, res) => {
  res.render("login", { loginType: null, msg: null });
});

router.get("/home",isAuthuser, handlegetHome);

router.get("/payment",isAuthuser, handlegetpayment);

router.get("/profile/:username",isAuthuser, handlegetprofile);

router.get("/tandc",isAuthuser, handlegetterms);

router.get("/contact",isAuthuser, handlegetcontact);

router.get("/connect",isAuthuser, handlegetconnect);

router.get("/games",isAuthuser, handlegetgames);

router.get("/stories",isAuthuser, handlegetstories);

router.get("/delacc",isAuthuser, handlegetdelacc);

router.get("/reels",isAuthuser, handlegetreels);

router.get("/create_post", isAuthuser, handlegetcreatepost);

router.get("/create_post_2", isAuthuser, handlegetcreatepost2)

router.get("/help",isAuthuser, handlegethelp);

router.get("/login",isAuthuser, (req, res) => {
  res.render("login", {
    loginType: null,
    msg: null,
  });
});

router.get("/admin", handlegetadmin);

router.get("/signup",isAuthuser, handlegetsignup);

router.post("/login",isAuthuser, handleLogin);

router.post("/signup",isAuthuser, handleSignup);

router.post("/contact",isAuthuser, handleContact);

router.post("/adminLogin", handleadminlogin);

router.post("/delacc",isAuthuser, handledelacc);

router.get("/forget-password", handlegetforgetpass);

router.post("/logout",isAuthuser, handlelogout);

router.post("/sendotp", sendotp);

router.post("/verifyotp", verifyotp);

router.post("/createpost", isAuthuser, handlecreatepost);

router.post("/updatepass", updatepass);

router.get("/imagKitauth",isAuthuser, handleimagKitauth);

router.get("/fpadmin", handlefpadmin);

router.get("/edit_profile",isAuthuser, handlegeteditprofile);

router.post("/updatepassadmin", adminPassUpdate);

router.get("/post_overlay",isAuthuser, handlegetpostoverlay);

export default router;