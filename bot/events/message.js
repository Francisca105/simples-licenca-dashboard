const discord = require("discord.js")
const bot = require("../../index")
require('dotenv').config();

bot.on("message", async (message) => {
    let prefix = process.env.PREFIX
    //
    if(message.author.bot || message.channel.type === "dm") return;

    if (!message.content.startsWith(prefix)) return;


    let args = message.content.slice(prefix.length).trim().split(/ +/)
    let cmd = args.shift().toLowerCase()

    let command;
    if (bot.commands.has(cmd)) {
        command = bot.commands.get(cmd)
    } else if (bot.aliases.has(cmd)) {
        command = bot.commands.get(bot.aliases.get(cmd))
    } else return

    try {
        command.run(bot, message, args)
    } catch (err) {
        console.log(err)
    }
})