var childProcess = require("child_process");
var Discord = require("discord.js");
var client = new Discord.Client();

var servers = {};

client.on("ready", function() {
	console.log("[master] Connected to Discord");
	var guilds = client.guilds.keyArray();
	for (var i = 0; i < guilds.length; i++) {
		fork(guilds[i]);
	}
});

client.on("guildCreate", function(guild) {
	if (!(guild.id in servers)) {
		fork(guild.id);
	}
});

client.on("guildDelete", function(guild) {
	if (guild.id in servers) {
		servers[guild.id].kill();
		delete servers[guild.id];
	}
});

function fork(guild) {
	servers[guild] = childProcess.fork(__dirname + "/bot.js", [process.argv[2], guild]);
}

client.login(process.argv[2]);
