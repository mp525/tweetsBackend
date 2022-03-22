var express = require("express");
const app = require("../app");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";
const bodyParser = require("body-parser");
var cors = require("cors");

/* GET all tweets. */
router.get("/", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var result1;
  MongoClient.connect(url, async function (err, db) {
    if (err) throw err;
    var dbo = db.db("Test");
    result1 = await dbo
      .collection("tweets")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        result1 = result;
        res.send(result);
        db.close();
      });
  });
});

router.post("/", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers: Origin, Content-Type, application/json"
  );
  MongoClient.connect(url, async function (err, db) {
    console.log("BODY");
    console.log(req.body);
    if (err) throw err;

    var dbo = db.db("Test");
    var obj = req.body;
    result1 = await dbo
      .collection("tweets")
      .insertOne(obj, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
  });
  res.send("1 document inserted");
});

/* GET top 10 hashtags. */
router.get("/hashtags", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var result1;
  MongoClient.connect(url, async function (err, db) {
    if (err) throw err;
    var dbo = db.db("Test");
    result1 = await dbo
      .collection("tweets")
      .aggregate([
        { $match: {} },
        { $unwind: "$entities.hashtags" },
        { $group: { _id: "$entities.hashtags.text", count: { $count: {} } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])
      .toArray(function (err, result) {
        if (err) throw err;
        result1 = result;
        res.send(result);
        db.close();
      });
  });
});

module.exports = router;
