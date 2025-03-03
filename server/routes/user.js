import express from "express";
import { handleSignup } from "../controllers/user.js";
import { handleimagKitauth } from "../services/imagKit.js";
// import externals from './Fns.js';

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login", {
    loginType: null,
  });
});

router.get("/signup", (req, res) => {
  res.render("Registration", {msg: ""});
});

router.post("/signup", handleSignup);

router.get("/forget-password", (req, res) => {
  res.render("Forgot_pass");
});

router.get('/imagKitauth',handleimagKitauth)

export default router;