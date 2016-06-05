var http = require('http');
var elm = require('./responder.js');


// SETUP ELM

var responder = elm.Responder.worker();

function feedResponder(jsonString)
{
	responder.ports.events.send(jsonString);
}


// SETUP SERVER

var PORT = 8080;

var server = http.createServer();

server.on('request', function(request, response) {
	getBody(request, feedResponder);
	response.end('thanks');
});

server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});


// HELPERS

function getBody(request, callback)
{
	var body = [];
	request.on('data', function(chunk) {
		body.push(chunk);
	}).on('end', function() {
		callback(Buffer.concat(body).toString());
	});
}
