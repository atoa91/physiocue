var express= require("express");
var router = express.Router();
var str2json = require("string-to-json");
var authMiddleware = require("../middlewares/auth");

var Main = require("../models/history");
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

router.route("/:cid/main/")
    .get(function(req, res, next){
        Main.find({clientId: req.cid}).sort({date:-1}).limit(1)
      .exec(function(error, mains) {
        if (error) return next(error);
        if (!mains) {
          return res.json({});
        }
        console.log(mains)
        return res.json(mains);
        //return res.render("main/list",{mains:mains});
    });
    })
//,authMiddleware.loginRequired
router
    .get("/measure/", function(req, res){
    return res.render("main/new", {});
})



router.route("/:cid/measure/")
    .post(function(req, res, next){
       var measure = new Main({
            clientId : req.cid,
            SYS : req.body.SYS,
            DIA : req.body.DIA,
            pulse :req.body.pulse,
            status : req.body.statuss,
        });
        
        measure.save(function(error){
            if(error)return next(error);
            req.flash("singup","success!");
            var message =str2json.convert({"success":"measure"});
            
            return res.json(message);
        }); 
    });

module.exports =router;