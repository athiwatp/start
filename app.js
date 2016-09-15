var express = require('express');
var app = express();
var ejs = require('ejs');
var mongo = require('mongodb');
var crypto = require('crypto');
var granted = [ ];

app.listen(2000);
app.engine('html', ejs.renderFile);
app.use(session);
app.get('/', (req, res) => res.render('index.html') );
app.get('/register', function(req, res) {
	res.render('register.html');
});
app.post('/register', registerNewUser);
app.get('/login', (req, res) => res.render('login.html'));
app.post('/login', loginUser);
app.get('/profile', showProfile);
app.get('/logout', logoutUser);
app.use( express.static('public') );

// install packages: npm install express ejs mongodb
// run:              node app

// mongodb on Windows:
// cd /Users/xxx/Desktop/mongo/bin
// mongod --dbpath . --storageEngine=mmapv1

// mongodb on macOS
// cd /Users/xxx/Dektop/mongo/bin
// ./mongod --dbpath .

function session(req, res, next) {
	var cookie = req.headers["cookie"];
	if (cookie == null) {
		cookie = "";
	}
	var data = cookie.split(";");
	for (var i = 0; i < data.length; i++) {
		var field = data[i].split("=");
		if (field[0] == "session") {
			req.session = field[1];
		}
	}
	if (req.session == null) {
		req.session = parseInt(Math.random() * 1000000) + 
				"-" + parseInt(Math.random() * 1000000) + 
				"-" + parseInt(Math.random() * 1000000) + 
				"-" + parseInt(Math.random() * 1000000);
		res.set("Set-Cookie", "session=" + req.session);
	}
	next();
}

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

		u.password = crypto.createHmac('sha256', u.password).digest('hex');

		mongo.MongoClient.connect('mongodb://127.0.0.1/start',
			(error, db) => {
				db.collection('user').find({email: u.email}).toArray(
					(error, data) => {
						if (data.length == 0) {
							db.collection('user').insert(u);
							res.redirect("/login");
						} else {
							res.redirect("/register?message=Duplicated Email");
						}
					}
				)
			}
		)
	});
}

function loginUser(req, res) {
	var data = "";
	req.on("data", chunk => data += chunk );
	req.on("end", () => {
		// data -> email=mark@facebook.com&password=mark123
		data = decodeURIComponent(data);
		var p = data.indexOf("&");
		var u = { }
		u.email = data.substring(6, p);
		u.password = data.substring(p + 10, data.length);
		u.password = crypto.createHmac('sha256', u.password).digest('hex');
		mongo.MongoClient.connect("mongodb://127.0.0.1/start", (error, db) => {
			db.collection("user").find(u).toArray((error, data) => {
				if (data.length == 0) {
					res.redirect("/login?message=Invalid Password");
				} else {
					granted[req.session] = data[0];
					res.redirect("/profile");
				}
			});
		});
	});
}

function showProfile(req, res) {
	if (granted[req.session] == null) {
		res.redirect("/login");
	} else {
		res.render("profile.html");
	}
}

function logoutUser(req, res) {
	delete granted[req.session];
	res.render("logout.html");
}