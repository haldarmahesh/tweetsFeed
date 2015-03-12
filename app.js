var mongoose = require('mongoose');
var express = require('express');
var app = express();
var port = 3000;
var Twit = require('twit');
process.setMaxListeners(0);
var T = new Twit({
  consumer_key: 'h71wsXZ16MdBtPVDLvTRrmVnd',
  consumer_secret: 'aj6V8D46VosM0CRMRNioi9YH6uhKQSVrvgCIsknQdhcUdalvJQ',
  access_token: '3012054320-daYiobkck9M3igwnyZVnLEhYpTxMI7bVlkILm7S',
  access_token_secret: '6Ac4EICp6ESzenhFOYKSH0EaylCUFo5ixlTM1lLCSaBDB'
});

app.set('views', __dirname + '/views')
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/chat', function(req, res) {
  res.render('page');
});

mongoose.connect('mongodb://localhost/db1');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
  console.log('message');
});

var TweetScheme = new mongoose.Schema({
  count: Number,
  screen_name: String,
  profile_image_url: String,
  name: String,
  description: String,
  text: String,
  media_url: String


});

var Tweet = mongoose.model('Tweet', TweetScheme); //model to be used for all CRUD operations

app.get('/show', function(req, res) {
  // Tweet.find({
  //   _id: '550050c1bfef68097a146cf8'
  // }, function(err, tweet) {
  //   if (!err) {
  //     {
  //       res.json(tweet);
  //       Tweet.find({
  //         _id: '550050c1bfef68097a146cf8'
  //       }).remove().exec();
  //     }
  //   }
  // }); 
  //#finding and deleting document
  //latest : Next iPhone will reportedly use Apple's Force Touch technology http://t.co/h30uYwPY3A
  Tweet.find({}, function(err, tweet) {
    if (!err) {
      {
        res.json(tweet);
      }
    }
  });

});
app.get('/empty', function(req, res) {
  Tweet.find({}).remove().exec();
  res.send('the db has been emptied');
});
app.get('/latest', function(req, res) {
  res.send(Tweet.find({}).sort({
    _id: -1
  }).limit(1));
  // var query = Tweet.findOne().sort({ field: 'asc', _id: -1 }).limit(1);
  // res.json(JSON.stringify(query.select('text')));
});

app.get('/tweets', function(req, res, next) {

  var count = 1;
  if (req.query.tweetType == 'all')
    getData(req, res, next);
  else {
    console.log("qqqqqq" + req.query.screenName);
    var stream = T.stream('statuses/filter', {
      track: req.query.screenName
    });


    io.sockets.on('connection', function(socket) {

      var interval = setInterval(function() {
        // console.log('calling setInterval();');
        console.log(countDisp + ' display counr');
        // console.log(message);
        var tweetDisplay = Tweet.find({
          count: countDisp
        }, function(err, tweetSend) {
          if (!err) {
            if (tweetSend.length > 0) {
              countDisp;
              // console.log(tweetSend + ' tweets to display');
              socket.emit('message', {
                message: tweetSend
              });
              Tweet.find({
                count: countDisp
              }).remove().exec();
              countDisp++;
            }

          } else
            console.log(err);

        });
      }, 4000);

      var countDisp = 1;
      Tweet.find({}).remove().exec();

      stream.on('tweet', function(tweet) {
        var mediaUrl = "no";
        if (tweet.entities.media)
          mediaUrl = tweet.entities.media[0].media_url;
        var tweetDB = new Tweet({
          text: tweet.text,
          count: count++,
          screen_name: tweet.user.screen_name,
          profile_image_url: tweet.user.profile_image_url,
          name: tweet.user.name,
          description: tweet.user.description,
          text: tweet.text,
          media_url: mediaUrl
        });
        tweetDB.save(function(err) {
          // if (!err)
          //   console.log('created');
          if (err)
            console.log(err);
        });
        // console.log(tweet);
        // socket.emit('message', {
        //   message: tweet
        // });
        socket.on('disconnect', function() {
          clearInterval(interval);
          console.log('DISCONNESSO!!! ');
          Tweet.find({}).remove().exec();
          stream.stop();

        });

      });


    });


    res.render('liveTweets', {
      screenName: req.query.screenName
    });
  }
});

function getData(req, res, next) {
  var options = {
    count: req.query.count,
    screen_name: req.query.screenName,
    // exclude_replies : true,
    include_entities: true
  };
  T.get('statuses/user_timeline', options, function(err, data) {

    for (var i = 0; i < data.length; i++) {
      console.log(data[i].created_at + " => " + data[i].text);
      console.log('--------------------------');
    }
    renderJade(data);
  });
  console.log('This is value ' + req.query.screenName);

  function renderJade(data) {
    res.render('tweets', {
      title: req.query.screenName,
      a: req.query.screenName,
      data: data
    });
  }
}



app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function(socket) {
  socket.emit('message', {
    message: 'welcome to the chat'
  });
  socket.on('send', function(data) {
    io.sockets.emit('message', data);
  });
});

console.log('listening to port' + port);
