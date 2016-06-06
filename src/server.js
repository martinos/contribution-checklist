
// READ CONFIGURATION FILE

var config = require("./config.json");

function demand(name)
{
	if (name in config)
	{
		return config[name];
	}
	console.error('Need `' + name + '` in config.json');
	process.exit(1);
}

var PORT = demand('port');
var TOKEN = demand('token');
var SECRET = demand('secret');


// LISTEN FOR EVENTS

var server = require('githubhook')({
	port: PORT,
	secret: SECRET,
	logger: {
		log: function() {},
		error: function() {}
	}
});

server.listen();

server.on('*', function (event, repo, ref, data) {
	try
	{
		commentOnIssue(data);
	}
	catch(e) {}
});


// SETUP GITHUB

var Client = require("github");
var github = new Client({ debug: false });

github.authenticate({
    type: "oauth",
    token: TOKEN
});


// COMMENT ON ISSUES

function commentOnIssue(event)
{
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
		'[checklist]: https://github.com/process-bot/contribution-checklist/blob/master/' + path + '.md',
		'[expectations]: https://github.com/process-bot/contribution-checklist/blob/master/expectations.md',
		'[participation]: https://github.com/process-bot/contribution-checklist/blob/master/participation.md'
	].join('\n');
}
