var express= require("express");
var router = express.Router();
var str2json = require("string-to-json");
var authMiddleware = require("../middlewares/auth");
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport('smtps://rahm.jihoon.lee%40gmail.com:rlehd3wndeo@smtp.gmail.com');


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


router.route("/getToken/")
    .post(function(req, res, next){
        Client.findOne({email:req.body.email}, function(error, client){
            if(!client){
                var error = new Error("User not found");
                error.status = 401;
                return next(error);
            }
            if(error) return next(error);
            var mailOptions = {
                from:'"Physiocue" <rahm.jihoon.lee@gmail.com>',
                to: client.email,
                subject :'Physiocue 가입메일',
                text: 'your id :'+client.clientId+'\nyour token :'+client.token,
                html: ''
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return next(error);
                }
                var message =str2json.convert({"success":info.response});
                return res.json(message);
            });
            
        });
    });

    
router.route("/tokenChange/")
    .post(function (req, res, next){
        Client.findOne({clientId:req.body.id}, function(error, client){
            if (!client) {
                  var error = new Error("User not found.");
                  error.status = 401;
                  return next(error);
                }
                if(error) return next(error);
                console.log(req.body.token == client.token);
                if(req.body.token != client.token){
                    var error = new Error("token is not matched.");
                    error.status= 401;
                    return next(error);
                }
                else{
                    Client.pwdCheck(req.body.id, req.body.password, function(error,result){//body -> req.user.clientId
                     if(error)return next(error);
                        req.flash("password","success!");
                        var message =str2json.convert({"success":result});
                        return res.json(message);   
                    });
                }
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