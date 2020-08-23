module.exports.help = {
    name: "verlicenca",
    aliases: ["licencas", "licenças", "licenca", "licença"]
}    
exports.run = async (client, message, args, err) => {
const Users = require('../../db/Usuarios')    
const Licencas = require('../../db/Licenças')
const discord = require('discord.js')

    let findU = await Users.findOne({
        where: {
        id: message.author.id
    }})

    if(!findU) return message.channel.send(`Não estás registrado no nosso site!`)
    let embed = new discord.MessageEmbed()
    .setTitle(`Licenças`)
    .setColor(client.cor)

    let email = findU.email

    let find1L = await Licencas.findOne({where:{
        email: email
    }})

    if(!find1L) return message.channel.send(embed.setDescription(`Parece que não compras-te nenhum plugin connosco ainda.`))
    
    let findL = await Licencas.findAll({where:{
        email: email
    }, attributes: ['plugin', 'licenca']})

    /*findL.forEach(f => {
        //console.log(f)
        //console.log(f.Licencas)
        console.log(f.dataValues)
    })*/
    let mapa = findL.map(f => {
        let dados = f.dataValues
        //console.log(dados)
        return dados.plugin + ' - ' + dados.licenca
    })

    message.delete()
    message.author.send(embed.addField('PLugin - Licença',mapa.join('\n'))).catch(e => {
        if(e) return message.channel.send(`Não consegui enviar-lhe a mensagem no privado!`)
    })
    //console.log(findL)

    /*
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
        })*/

}