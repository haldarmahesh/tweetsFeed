var express = require('express');
var app = express();
var port = 3000;
var Twit = require('twit');

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


app.get('/tweets', function(req, res, next) {
  // if (req.query.screenName == null) {
  //   console.log('Error');
  //   res.redirect('error');
  // }
  if (req.query.tweetType == 'all')
    getData(req, res, next);
  else {
    console.log("qqqqqq" + req.query.screenName);
    var stream = T.stream('statuses/filter', {
      track: req.query.screenName
    });


    io.sockets.on('connection', function(socket) {
      stream.on('tweet', function(tweet) {
        console.log(tweet);
        socket.emit('message', {
          message: tweet
        });
        socket.on('disconnect', function() {
          console.log('DISCONNESSO!!! ');
          stream.stop();
        });

      });
    });


    res.render('liveTweets',{screenName:req.query.screenName});
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
