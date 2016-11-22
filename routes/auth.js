var express = require("express");
var router = express.Router();
var str2json = require("string-to-json");

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Client = require("../models/client");
var authMiddleware = require("../middlewares/auth");

router.route("/login/")
    .get(function(req, res){
        return res.render("auth/login");
    })
    .post(passport.authenticate('local',{failureRedirect:"/login/"}),
    function(req, res, next){
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

router.route('/signup/')
    .get(function(req, res, next){
        return res.render("auth/signup");
    })
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
            medication : req.body.medication
        });
        
        client.save(function(error){
            if(error)return next(error);
            req.flash("singup","success!");
            var message =str2json.convert({"success":"signup success"});
            return res.json(message);
            //return res.redirect("/");
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