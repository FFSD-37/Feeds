import { verify_JWTtoken } from "cookie-string-parser";

const isAuthuser = (req, res, next) => {

    const isAuth=verify_JWTtoken(req.cookies.uuid, process.env.USER_SECRET);
    if(isAuth){
        if(req.url==="/login" || req.url==="/signup" || req.url==="/forgetpass" || req.url==='/'){
            return res.redirect("/home");
        }
        req.userDetails=isAuth;
        next();
    }else{
        res.cookie("uuid", "", { maxAge: 1 });
        if(req.url==="/login" || req.url==="/signup" || req.url==="/forgetpass" || req.url==='/'){
            return next();
        }
        return res.redirect("/login");
    }
}

export {isAuthuser};