

// READ CONFIGURATION FILE

var config = require("./config.json");

if (typeof config.port === 'undefined')
{
	console.error('Need a port.');
	process.exit(1);
}

if (typeof config.token === 'undefined')
{
	console.error('Need a token.');
	process.exit(1);
}

var PORT = config.port;
var TOKEN = config.token;


// SETUP GITHUB

var Client = require("github");
var github = new Client({ debug: false });

github.authenticate({
    type: "oauth",
    token: TOKEN
});


// SETUP SERVER

var http = require('http');

var server = http.createServer();

server.on('request', function(request, response) {
	withBody(request, commentOnIssue);
	response.end();
});

server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:" + PORT);
});


// READ DATA

function withBody(request, callback)
{
	var chunks = [];
	request.on('data', function(chunk) {
		chunks.push(chunk);
	}).on('end', function() {
		var body = Buffer.concat(chunks).toString();
		callback(body);
	});
}


// WRITE DATA

function commentOnIssue(json)
{
	try
	{
		commentOnIssueHelp(json);
	}
	catch(e) {}
}

function commentOnIssueHelp(json)
{
	var event = JSON.parse(json);

	if (event.action !== 'opened')
	{
		return;
	}

	github.issues.createComment({
		user: event.repository.owner.login,
		repo: event.repository.name,
		number: (event.issue || event.pull_request).number,
		body: typeof event.issue !== 'undefined'
			? makeMessage('issue', 'issues')
			: makeMessage('pull request', 'pulls')
	});
}

function makeMessage(noun, path)
{
	return [
		'Thanks for the ' + noun + '! Make sure it satisfies [this checklist][checklist]. My human colleagues will appreciate it!',
		'',
		'Here is [what to expect next][expectations], and if anyone wants to comment, keep [these things][participation] in mind.',
		'',
		'[checklist]: https://github.com/process-bot/the-process/blob/master/' + path + '.md',
		'[expectations]: https://github.com/process-bot/the-process/blob/master/expectations.md',
		'[participation]: https://github.com/process-bot/the-process/blob/master/participation.md'
	].join('\n');
}
