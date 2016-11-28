var express= require("express");
var router = express.Router();
var str2json = require("string-to-json");
var authMiddleware = require("../middlewares/auth");

var History = require("../models/history");
var Client = require("../models/client");

router.param("cid",function(req, res, next, cid){

    Client.findOne({clientId:cid}, function(error,cidright){
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

router.get("/:cid/weekly/",
    function(req, res, next){
        History.weekly(req.cid, function(err, result){
            if(err) return next(err);
            return res.json(result);
        });
    
        
        //req.flash("success","Succesfuly weekly");
    });


router.param("cid",function(req, res, next, cid){
    
    Client.findOne({clientId:cid}, function(error,cidright){
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

router.route("/:cid/daily/")
    .get(function(req, res, next){
        History.find({clientId: req.cid}).sort({date:-1})
      .exec(function(error, datas) {
        if (error) return next(error);
        if (!datas) {
          var error = new Error("Main not found.");
          error.status = 401;
          return next(error);
        }
        return res.json(datas);
        //return res.render("main/list",{mains:mains});
    });
    })
    
router.param("cid",function(req, res, next, cid){
    Client.findOne({clientId:cid}, function(error,cidright){
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

router.route("/:cid/day/")
    .post(function(req, res, next){
        var setTime= new Date(req.body.year,req.body.month-1,req.body.day,23,59,59);
        console.log(req.body);
        History.find({clientId: req.cid, date:{$lte: setTime, $gt:setTime-24*60*60*1000}}).sort({date:-1})
      .exec(function(error, datas) {
        if (error) return next(error);
        if (!datas) {
          var error = new Error("Main not found.");
          error.status = 401;
          return next(error);
        }
        return res.json(datas);
        //return res.render("main/list",{mains:mains});
    });
    })


router.param("cid",function(req, res, next, cid){
    Client.findOne({clientId:cid}, function(error,cidright){
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

router.get("/:cid/monthly/",
    function(req, res, next){
        History.monthly(req.cid, function(err, result){
            if(err) return next(err);
            return res.json(result);
        });
    
        
        //req.flash("success","Succesfuly weekly");
    });
// 3monthly

router.param("cid",function(req, res, next, cid){
    Client.findOne({clientId:cid}, function(error,cidright){
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


router.get("/:cid/threeMonthly/",
    function(req, res, next){
        History.threeMonthly(req.cid, function(err, result){
            if(err) return next(err);
            return res.json(result);
        });
        //req.flash("success","Succesfuly weekly");
    });

module.exports =router;