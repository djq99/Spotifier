const express = require('express')
var request = require('request'); // "Request" library
var client_id = '4b3b85a4260a45368c36c41d07e67238'; // Your client id
var client_secret = 'e6d94a3fee59498ab366c7790f169785'; // Your secret

var path = require('path');

const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, 'views')));


app.get('/', function(req, res){
	res.render('index')
})


app.get('/search',function(req,res){
	var searchText = req.query.text
	if(searchText != null && searchText.trim().length > 0) {
		var authOptions = {
			url: 'https://accounts.spotify.com/api/token',
			headers: {
				'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
			},
			form: {
				grant_type: 'client_credentials'
			},
			json: true
		};

		request.post(authOptions, function (error, response, body) {
			if (!error && response.statusCode === 200) {

				// use the access token to access the Spotify Web API
				var token = body.access_token;
				var options = {
					url: 'https://api.spotify.com/v1/search',
					qs: {
						q: searchText,
						type: 'artist',
						limit: 50
					},
					headers: {
						'Authorization': 'Bearer ' + token
					},
					json: true
				};

				request.get(options, function (error, response, body) {
					// console.log(body.artists.items[0]);
					res.send(body.artists.items)
				});
			}
		});
	}
})

app.listen(port, function(err) {
	if (err) {
		return console.log('something bad happened', err)
	}

	console.log(`server is listening on ${port}`)
})