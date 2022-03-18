var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";



/* GET all tweets. */
router.get('/', function (req, res, next) {
  var result1;
  MongoClient.connect(url, async function (err, db) {
    if (err) throw err;
    var dbo = db.db("Test");
    result1 = await dbo.collection("tweets").find({}).toArray(function (err, result) {
      if (err) throw err;
      result1 = result;
      res.send(result);
      db.close();
    });
  });
});

router.post('/', function (req, res, next) {
  MongoClient.connect(url, async function (err, db) {
    if (err) throw err;
    var dbo = db.db("Test");
    var obj = req.body;
    result1 = await dbo.collection("tweets").insertOne(obj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
  res.send("1 document inserted");
}); 

module.exports = router;
