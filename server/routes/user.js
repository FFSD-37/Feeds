import express from "express";

const router = express.Router();

router.get('/login',(req,res)=>{
    res.render('login',{
        loginType:null
    });
})
router.get("/signup", (req, res) => {
  res.render("Registration");
});

router.get("/forget-password", (req, res) => {
  res.render("Forgot_pass");
});
export default router;