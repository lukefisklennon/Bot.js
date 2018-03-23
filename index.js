/*
{"commands":{"argstest":{"code":"channel.send(args);","info":""},"sum":{"code":" \nvar result = 0; \nfor (var i = 0; i < args.length; i++) { \n    result += Number(args[i]); \n} \nchannel.send(args.join(\" + \") + \" = \" + result); \n","info":""},"calc":{"code":" \nargs = message.content.split(\" \"); \nif (args[1] == \"+\") { \n    channel.send(Number(args[0]) + Number(args[2])); } \nelse if (args[1] == \"-\"){ \n    channel.send(Number(args[0]) - Number(args[2])); } \nelse if (args[1] == \"*\") { \n    channel.send(Number(args[0]) * Number(args[2])); } \nelse if (args[1] == \"/\") { \n    channel.send(Number(args[0]) / Number(args[2])); } \nelse if (args[1] == \"%\") { \n    channel.send(Number(args[0]) / Number(args[2])); } \nelse { \n    channel.send(\"wtf r u talking about\"); } \n","info":""},"remind":{"code":"var time = args[0]; \nargs.shift(); \nvar m = args.join(\" \"); \nsetTimeout(function() { \n    channel.send(m); \n}, time * 1000);","info":""}},"global":{"count":2}}
*/

var vm = require("vm");
var Discord = require("discord.js");
var client = new Discord.Client();

var prefix = "$";
var commandNames = ["run", "create", "edit", "show", "info", "delete", "export", "import", "list", "help"];

var commands = {};
var globalData = {};

function run(command, options, message) {
	try {
		switch (command) {
		case "run":
			options.shift();
			var code = extractCode(options.join(" "));
			runScript(createScript(code, "<anonymous>"), message, null);
			break;
		case "create":
			var name = options[0];
			options.shift();
			var code = extractCode(options.join(" "));
			if (commandNames.indexOf(name) != -1) {
				message.channel.send("Cannot create command `" + name + "`: it is a reserved name");
			}
			if (name in commands) {
				message.channel.send("Cannot create command `" + name + "`: it already exists");
			}
			var success = true;
			try {
				commands[name] = {
					script: createScript(code, name),
					code: code,
					info: ""
				};
			} catch(e) {
				success = false;
				message.channel.send("```" + formatError(e) + "```");
			}
			if (success) {
				message.channel.send("Created command `" + name + "`");
			}
			break;
		case "edit":
			var name = options[0];
			options.shift();
			var code = extractCode(options.join(" "));
			if (name in commands) {
				var success = true;
				try {
					commands[name].script = createScript(code, name);
					commands[name].code = code;
				} catch(e) {
					success = false;
					message.channel.send("```" + formatError(e) + "```");
				}
				if (success) {
					message.channel.send("Edited command `" + name + "`");
				}
			} else {
				message.channel.send("Command not found: `" + name + "`");
			}
			break;
		case "show":
			var name = options[0];
			if (name in commands) {
				message.channel.send("```JS\n" + commands[name].code + "\n```");
			}
			break;
		case "info":
			var name = options[0];
			if (name in commands) {
				if (options.length > 1) {
					options.shift();
					var info = options.join(" ").trim();
					commands[name].info = info;
					message.channel.send("Saved info for `" + name + "`");
				} else {
					if (commands[name].info != "") {
						message.channel.send("```" + name + ": " + commands[name].info + "```");
					} else {
						message.channel.send("No info set for `" + name + "`");
					}
				}
			} else {
				message.channel.send("Command not found: `" + name + "`");
			}
			break;
		case "delete":
			var name = options[0];
			if (name in commands) {
				delete commands[name];
				message.channel.send("Deleted command `" + name + "`");
			} else {
				message.channel.send("Command not found: `" + name + "`");
			}
			break;
		case "export":
			var data = {};
			data.commands = {};
			data.global = globalData;
			for (var command in commands) {
				data.commands[command] = {
					code: commands[command].code,
					info: commands[command].info
				};
			}
			message.channel.send("```JSON\n" + JSON.stringify(data) + "\n```");
			break;
		case "import":
			var data = JSON.parse(options.join(" "));
			for (var command in data.commands) {
				try {
					commands[command] = {
						script: createScript(data.commands[command], command),
						code: data.commands[command].code,
						info: data.commands[command].info
					};
				} catch(e) {
					message.channel.send("Error when importing `" + command + "`\n```" + formatError(e) + "```");
				}
				for (var g in data.global) {
					globalData[g] = data.global[g];
				}
			}
			message.channel.send("Imported data");
			break;
		case "list":
			if (Object.keys(commands).length > 0) {
				var string = "```\n";
				for (var command in commands) {
					string += command;
					if (commands[command].info != "") {
						string += ": " + commands[command].info;
					}
					string += "\n";
				}
				string += "```";
				message.channel.send(string);
			} else {
				message.channel.send("No commands found");
			}
			break;
		case "help":
			message.channel.send("Help page coming soon!");
			break;
		default:
			if (command in commands) {
				message.content = options.join(" ");
				runScript(commands[command].script, message, command);
			} else {
				message.channel.send("Command not found: `" + command + "`");
			}
			break;
		}
	} catch(e) {
		console.log(e);
		message.channel.send("Malformed input");
	}
}

client.on("ready", function() {
	console.log("Connected to Discord");
	client.user.setPresence({game: {name: "$help", type: 0}});
});

client.on("message", function(message) {
	if (message.author != client.user) {
		var text = message.content;
		if (text[0] == prefix) {
			var parts = text.split("\n").join(" \n").split(" ");
			var command = parts[0].substring(1);
			parts.shift();
			run(command, parts, message);
		}
	}
});

client.login(process.argv[2]);

function exitHandler() {
	var data = {};
	data.commands = {};
	data.global = globalData;
	for (var command in commands) {
		data.commands[command] = {
			code: commands[command].code,
			info: commands[command].info
		};
	}
	client.user.lastMessage.channel.send("Exporting before exit\n```JSON\n" + JSON.stringify(data) + "\n```");
	setTimeout(function() {
		process.exit();
	}, 500);
}

process.on("exit", exitHandler);
process.on("SIGINT", exitHandler);
process.on("SIGUSR1", exitHandler);
process.on("SIGUSR2", exitHandler);
process.on("uncaughtException", exitHandler);

function createScript(code, name) {
	return new vm.Script(code, {
		filename: name,
		timeout: 500,
		contextName: name,
		displayErrors: true
	});
}

function runScript(script, message, command) {
	try {
		script.runInNewContext({
			command: command,
			message: message,
			text: message.content,
			args: message.content.split(" "),
			guild: message.channel.guild,
			channel: message.channel,
			user: message.author,
			member: message.member,
			global: globalData,
			Buffer: Buffer,
			clearImmediate: clearImmediate,
			clearInterval: clearInterval,
			clearTimeout: clearTimeout,
			setImmediate: setImmediate,
			setInterval: setInterval,
			setTimeout: setTimeout
		});
	} catch(e) {
		message.channel.send("```" + formatError(e) + "```");
	}
}

function extractCode(code) {
	code = code.trim();
	if (code.substring(0, 13) == "```JavaScript") {
		code = code.substring(5, code.length - 3);
	} else if (code.substring(0, 5) == "```JS") {
		code = code.substring(5, code.length - 3);
	} else if (code.substring(0, 3) == "```") {
		code = code.substring(3, code.length - 3);
	}
	return code;
}

function formatError(e) {
	var parts = e.stack.split("\n\n");
	return parts[0] + "\n" + parts[1].split("\n")[0];
}
