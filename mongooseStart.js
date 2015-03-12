var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:3000/test');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
  // Create your schemas and models here.
  var movieSchema = new mongoose.Schema({
    title: {
      type: String
    },
    rating: String,
    releaseYear: Number,
    hasCreditCookie: Boolean
  });

  var Movie = mongoose.model('Movie', movieSchema);

  var thor = new Movie({
    title : 'Thor',
    rating : 'PG-13',
    releaseYear : '2011',
    hasCreditCookie : true
  });
  thor.save(function(err, thor){
    if(err) return console.log(err);
    console.log(thor);
  });
});

