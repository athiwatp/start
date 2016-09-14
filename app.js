var express = require('express');
var app = express();
var ejs = require('ejs');
app.listen(2000);
app.engine('html', ejs.renderFile);

app.get('/', (req, res) => res.render('index.html') );

app.get('/register', function(req, res) {
	res.render('register.html');
});



// install packages: npm install express ejs
// run:              node app
