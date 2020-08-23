const fs = require('fs')
const bot = require('../../index')

module.exports.loadEvents = () => {

    fs.readdir("./bot/events/", (err, files) => {
        if (err) console.error(err);
        let jsfiles = files.filter(f => f.split(".").pop() === "js");
        if (jsfiles.length <= 0) return console.log("Não encontrei nenhum evento.");
        jsfiles.forEach((f, i) => {
            require(`../events/${f}`);
            console.log(`${i + 1}: ${f} carregado!`);
        });
    });
}

module.exports.loadCommands = () => {
    fs.readdir("./bot/comandos/", (err, files) => {
        if (err) console.error(err);
        let jsfiles = files.filter(f => f.split(".").pop() === "js");
    
        if (jsfiles.length <= 0) return console.log("Não econtrei nenhum comando.");
    
        jsfiles.forEach((f, i) => {
            let props = require(`../comandos/${f}`);
            console.log(`${i + 1}: ${f} carregado!`);
            bot.commands.set(props.help.name, props);
            props.help.aliases.forEach(alias => {
                bot.aliases.set(alias, props.help.name);
            });
        });
    });
}