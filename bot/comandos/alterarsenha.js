module.exports.help = {
    name: "alterarsenha",
    aliases: ["mudarsenha"]
}    
exports.run = async (client, message, args, err) => {
const Users = require('../../db/Usuarios')    
const discord = require('discord.js')

    let findU = await Users.findOne({
        where: {
        id: message.author.id
    }})

    if(!findU) return message.channel.send(`Não estás registrado no nosso site!`)
    let enviar = await message.author.send(new discord.MessageEmbed().setTitle(`Senha`).setDescription(`Digita a senha que queres colocar no login!`).setColor(client.cor))
        .catch(e => {throw e})

        const filter = (user) => {
            return user
        };

        let colector = enviar.channel.createMessageCollector(filter, { max: 1, time: 30 * 1000})

        colector.on('collect', async (pass) => {
            let newp = pass.content;
            await Users.update({ senha: newp }, { where: { id: message.author.id }});
            enviar.channel.send(new discord.MessageEmbed().setTitle(`Sucesso`).setDescription(`A tua senha foi mudada para ${newp}!`).setColor(client.cor))
            message.delete()
        })

}