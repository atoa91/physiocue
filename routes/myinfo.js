var express= require("express");
var router = express.Router();
var str2json = require("string-to-json");
var authMiddleware = require("../middlewares/auth");

var Client = require("../models/client");

router.param("cid",function(req, res, next, cid){
    Client.findOne({clientId:cid}, function(error, cidright){
        if (!cidright) {
          var error = new Error("User not found.");
          error.status = 401;
          return next(error);
        }
        if(error) return next(error);
        req.cid = cidright.clientId;
        next();
    });
});

router.route("/:cid/myinfo/password",authMiddleware.loginRequired)
    .post(function (req, res, next){
        Client.pwdCheck(req.cid, req.body.password, function(error,result){//body -> req.user.clientId
         if(error)return next(error);
            req.flash("singup","success!");
            var message =str2json.convert({"success":result});
            return res.json(message);   
        });
         
         
    });

router.param("cid",function(req, res, next, cid){
    Client.findOne({clientId:cid}, function(error, cidright){
        if (!cidright) {
          var error = new Error("User not found.");
          error.status = 401;
          return next(error);
        }
        if(error) return next(error);
        req.cid = cidright.clientId;
        next();
    });
});

router.route("/:cid/myinfo/")
    .post(function (req, res, next){
        Client.infoChange(req.cid,req.body.email,req.body.weight,req.body.height,req.body.arm,req.body.medication, function(error,result){//body -> req.user.clientId
         if(error)return next(error);
            req.flash("singup","success!");
            var message =str2json.convert({"success":result});
            return res.json(message);   
        });
         
         
    });



module.exports =router;