const Discord = require("discord.js")
const bot = require("../../index")
const db = require('../../db/database')
const Licencas = require('../../db/Licenças')
const Users = require('../../db/Usuarios')

bot.on("ready", () => {
    console.log(`[BOT] ${bot.user.username} está agora online!`)
    bot.user.setActivity("fiquei online!");

    setTimeout(()=>{
        bot.user.setActivity('desenvolvido pela Francisca.105#8965');
    }, 10000)
    
    db.authenticate().then(() => {
        console.log("[DB] Conectado à base de dados!")
        Licencas.init(db)
        Licencas.sync({ force: true })
        Users.init(db)
        Users.sync({ force: true })
    
    }).catch(function(err){console.log("\n\n[DB] Ocorreu um erro ao conectar na base de dados!\n" + err)})
})