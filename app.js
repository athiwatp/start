var express = require('express');
var app = express();
var ejs = require('ejs');
var mongo = require('mongodb');
app.listen(2000);
app.engine('html', ejs.renderFile);

app.get('/', (req, res) => res.render('index.html') );

app.get('/register', function(req, res) {
	res.render('register.html');
});

app.post('/register', registerNewUser);

// install packages: npm install express ejs mongodb
// run:              node app

// mongodb on Windows:
// cd /Users/xxx/Desktop/mongo/bin
// mongod --dbpath . --storageEngine=mmapv1

// mongodb on macOS
// cd /Users/xxx/Dektop/mongo/bin
// ./mongod --dbpath .

function registerNewUser(req, res) {
	var data = "";
	req.on("data", chunk => data += chunk )
	req.on("end", () => {
		data = decodeURIComponent(data);
		data = data.replace(/\+/g, ' ');
		var a = data.split('&');
		var u = { };
		for (var i = 0; i < a.length; i++) {
			var f = a[i].split('=');
			u[f[0]] = f[1];
		}

		mongo.MongoClient.connect('mongodb://127.0.0.1/start',
			(error, db) => {
				db.collection('user').insert(u);
			}
		)

		res.redirect("/");
	});
}
