const path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    config = require('./config/database');

require('dotenv').config();
const app = express();
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/images', express.static('./images'));
app.use(express.static(__dirname + '/src')); // Allow front end to access public folder

app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

if(process.env.NODE_ENV === 'production'){
  mongoose.connect(config.database);
} else {
  mongoose.connect('mongodb://localhost/test');
  mongoose.set('debug', true);
}

require('./models/User');
require('./models/Review');
require('./models/Tutorial');
require('./models/Step');
require('./models/Image');
require('./config/passport');

app.use(require('./routes'));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});

// Set Application Static Layout
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/src/index.html')); // Set index.html as layout
});

// finally, let's start our server...
var server = app.listen( process.env.PORT || 3000, function(){
  console.log('Listening on port ' + server.address().port);
});
