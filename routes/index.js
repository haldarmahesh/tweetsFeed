var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/maa', function(req, res, next) {
  res.render('maa', {
    title: 'Express'
  });
});
var Twit = require('twit');

var T = new Twit({
  consumer_key: 'h71wsXZ16MdBtPVDLvTRrmVnd',
  consumer_secret: 'aj6V8D46VosM0CRMRNioi9YH6uhKQSVrvgCIsknQdhcUdalvJQ',
  access_token: '3012054320-daYiobkck9M3igwnyZVnLEhYpTxMI7bVlkILm7S',
  access_token_secret: '6Ac4EICp6ESzenhFOYKSH0EaylCUFo5ixlTM1lLCSaBDB'
});
var options = [];

var firstLoad = true;
router.get('/tweets', function(req, res, next) {
  // if (req.query.screenName == null) {
  //   console.log('Error');
  //   res.redirect('error');
  // }
  options = {
    count: req.query.count,
    screen_name: req.query.screenName,
    // exclude_replies : true,
    include_entities: true
  };
  setInterval(function() {
    getData(req, res, next);
  }, 2000);
});

function getData(req, res, next) {

  T.get('statuses/user_timeline', options, function(err, data) {
    if (firstLoad) {
      renderJade(data);
      firstLoad = false;
    }
  });

  if (!firstLoad) {
    console.log('mamamamamamam');
  }
  console.log('This is value ' + req.query.screenName);

  function renderJade(data) {
    res.render('tweets', {
      title: req.query.screenName,
      a: req.query.screenName,
      data: data
    });
  }
}
module.exports = router;
