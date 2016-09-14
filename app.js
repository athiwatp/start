var express = require('express');
var app = express();
var ejs = require('ejs');
app.listen(2000);
app.engine('html', ejs.renderFile);

app.get('/', (req, res) => res.render('index.html') );

app.get('/register', function(req, res) {
	res.render('register.html');
});

app.post('/register', registerNewUser);

// install packages: npm install express ejs
// run:              node app

function registerNewUser(req, res) {
	var data = "";
	req.on("data", chunk => data += chunk )
	req.on("end", () => {
		data = decodeURIComponent(data);
		data = data.replace(/\+/g, ' ');
		var a = data.split('&');
		for (var i = 0; i < a.length; i++) {
			
		}
		res.redirect("/");
	});
}
