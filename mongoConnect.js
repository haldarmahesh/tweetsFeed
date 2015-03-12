var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:3000/twitterapp", function(err, db) {
  if(!err) {
    console.log("We are connected");
  }
});