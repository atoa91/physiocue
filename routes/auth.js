var express = require("express");
var router = express.Router();
var str2json = require("string-to-json");
var hat = require('hat');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport('smtps://rahm.jihoon.lee%40gmail.com:rlehd3wndeo@smtp.gmail.com');

var Client = require("../models/client");
var authMiddleware = require("../middlewares/auth");

router.route("/login/")
    .get(function(req, res){
        return res.render("auth/login");
    })
    .post(passport.authenticate('local',{failureRedirect:"/login/"}),
    function(req, res, next){
        // console.log('hi');
        // console.log(req.body.pushToken);
        Client.updateToken(req.body.username, req.body.pushToken, function(err, result){
            if(err) console.log(err);
            console.log("token!");
        });
        
        // Client.pushAlert(req.body.username,function(error,result){
        //     if(error) console.log(error);
        //     console.log("push!")
        // })
        
        req.flash("success","Succesfuly login");
          var text = ("{"+
            '"_id":'+'"'+req.user._id+'"'+
            ',"clientId":'+'"'+req.user.clientId +'"'+
            ',"email":' +'"'+ req.user.email +'"'+
            ',"sex":' + req.user.sex +
            ',"weight":' + req.user.weight +
            ',"height":' + req.user.height +
            ',"arm":' + req.user.arm +
            ',"medication":' +'"'+ req.user.medication +'"'+ 
            "}");
        var obj = JSON.parse(text);
        return res.json(obj);
    }
);

router.route('/signup/').get(function(req, res, next){
    return res.render("auth/signup");
})
    .post(function(req, res, next){
        var match = res.locals.match;
        //console.log("this is match ="+match);

        var mailOptions = {
                from:'"Physiocue" <rahm.jihoon.lee@gmail.com>',
                to: req.body.email,
                subject :'Physiocue Certification number for signup.',
                text: 'Certification number :'+ match,
                html: ''
            };
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return next(error);
                }
                req.session.match = match;
                var message =str2json.convert({"success":"send"});
                return res.json(message);
            });
        
    });

router.route('/signupCheck/')
.get(function(req, res, next){
    return res.render("auth/signupCheck");
})
.post(function(req,res,next){
    if(!req.body.checkNum){
        var error = new Error('please send certification');
        return next(error);
    }
    
    var match = res.locals.match;
    //console.log('this is a match='+match);

    if(match == req.body.checkNum){
        var message =str2json.convert({"success":"next level"});
        return res.json(message);
    }
    else{
        var message =str2json.convert({"failure":"please check your certification number"});
        return res.json(message);
    }
});

router.route('/signupConfirm/')
    .post(function(req, res, next){
        var client = new Client({
            clientId: req.body.clientId,
            password: req.body.password,
            email : req.body.email,
            age : req.body.age,
            sex : req.body.sex,
            weight : req.body.weight,
            height : req.body.height,
            arm : req.body.arm,
            medication : req.body.medication,
            pushToken:''
        });
        
        client.save(function(error){
            if(error)return next(error);
            req.flash("singup","success!");
            var message =str2json.convert({"success":"signup success"});
            return res.json(message);
        });
    });

router.get('/logout/', function(req, res){
    req.session.destroy();
    res.redirect("/");
});

router.get("/profile/", authMiddleware.loginRequired, function(request, response) {
  return response.render("auth/profile");
});

module.exports = router;