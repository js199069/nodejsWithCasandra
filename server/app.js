
/**
 * Module dependencies.
 */
require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const http = require('http');
const path = require('path');

//load all routes
const users = require('./routes/users');
//load cassandra route
const cassandrainfo = require('./routes/cassandrainfo');

const app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/cassandrainfo', cassandrainfo.init_cassandra);
app.get('/users', users.list);
app.get('/users/add', users.add);
app.post('/users/add', users.save);
app.get('/users/delete/:id', users.delete_user);
app.get('/users/edit/:id', users.edit);
app.post('/users/edit/:id',users.save_edit);


app.use(app.router);






http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
