var express = require("express");
var router = express.Router();

var mainApiRouter = require("./main");


router.use("/main/", mainApiRouter);

module.exports = router;
