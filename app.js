var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//create file
var fs = require('fs');

var readSource = 'public/files/file';

app.post('/file', function(request, response){
    var textReq = request.body.text;

    fs.exists(readSource, function(exists) {
        if (exists) {
            var fileData = fs.readFileSync(readSource, "utf8");
            response.set('Content-Type', 'text/html');
            var htmlResponse =
                '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">' +
                '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.css">' +
                '<link rel="shortcut icon" href="/images/favicon.ico" type="image/x-icon" />' +
                '<link rel="stylesheet" href="/stylesheets/style.css" />' +
                '<div class="container"><div class="row"><div class="col-md-6">' +
                '<h3><i class="fa fa-backward" aria-hidden="true"></i> <a href="/">Back</a></h3>' +
                '<br>' +
                '<h3>In file the text ' +
                '<span class="enter-data">' +
                '"' +
                fileData +
                '"' +
                '</span>' +
                ' was changed to ' +
                '<span class="enter-data">' +
                '"' +
                textReq +
                '"' +
                '</span>' +
                '</h3>' +
                '</div></div></div>';
            response.send(htmlResponse);
            fs.writeFile(readSource, textReq, function (err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was updated!");
                response.end();
            });
        } else {
            fs.writeFile(readSource, textReq, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was created!");
                response.set('Content-Type', 'text/html');
                var htmlResponse =
                    '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">' +
                    '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.css">' +
                    '<link rel="shortcut icon" href="/images/favicon.ico" type="image/x-icon" />' +
                    '<link rel="stylesheet" href="/stylesheets/style.css" />' +
                    '<div class="container"><div class="row"><div class="col-md-6">' +
                    '<h3><i class="fa fa-backward" aria-hidden="true"></i> <a href="/">Back</a></h3>' +
                    '<br>' +
                    '<h3>The file with text ' +
                    '<span class="enter-data">' +
                    '"' +
                    textReq +
                    '"' +
                    '</span>' +
                    ' was created!</h3>' +
                    '</div></div></div>';
                response.send(htmlResponse);
                response.end();
            });
        }
    });

});

module.exports = app;
