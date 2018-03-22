var vm = require("vm");
var Discord = require("discord.js");
var client = new Discord.Client();

var prefix = "$";
var commandNames = ["create", "edit", "delete", "help"];

var commands = {};

function run(command, content, message) {
	switch (command) {
	case "create":
		var parts = content.split("\n");
		var name = parts[0];
		var code = "";
		if (parts.length > 1) {
			code = parts[1];
		}
		if (commandNames.indexOf(name) != -1) {
			return "cannot create command `" + name + "`: it is a reserved name";
		}
		if (name in commands) {
			return "cannot create command `" + name + "`: it already exists (use `" + prefix + "edit` to change the command)";
		}
		commands[name] = new vm.Script(code);
		return "created command `" + name + "`";
		break;
	default:
		if (command in commands) {
			var sandbox = {
				send: function(text) {
					channel.send(text);
				},
				message: message
			}
			var context = vm.createContext(sandbox);
			commands[command].runInContext(context);
		} else {
			return "command not found: `" + command + "`";
		}
	}
}

client.on("ready", function() {
	console.log("Connected to Discord");
	client.user.setPresence({game: {name: "$help", type: 0}});
});

client.on("message", function(message) {
	var text = message.content;
	if (text[0] == prefix) {
		var parts = text.split(" ");
		var command = parts[0].substring(1);
		parts.shift();
		var reply = run(command, parts.join(""), message);
		if (reply) {
			message.reply(reply);
		}
	}
});

client.login("NDI2MjM1NzMzNTk0OTk2NzQ4.DZTCgA.U_ByXjdS0bP6ucKxvdqGlEdoJ5I");
