const Discord = require("discord.js")
const bot = require("../../index")
const db = require('../../db/database')
const Users = require('../../db/Usuarios')
const { where } = require("sequelize")

bot.on("guildMemberAdd", async (membro) => {
    let findU = await Users.findOne({
        where: {
        id: membro.user.id
    }})

    if(findU) return;

    
    else {
        function pass(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
         }
    
        let password = pass(6)

        let enviar = await membro.send(new Discord.MessageEmbed().setTitle(`Email`).setDescription(`Envie o email para registrar no nosso site!`).setColor(bot.cor))
        .catch(e => {throw e})

        let filtro = m => m.content.includes('@');

        let colector = enviar.channel.createMessageCollector(filtro, { max: 1})

        colector.on('collect', async (e_mail) => {

            let email = e_mail.content;

            let findE = await Users.findOne({
                where: {
                email: email
            }})
            if(findE) return message.channel.send(`Esse email já está cadastrado!`)
            
            await Users.create({
                id: membro.user.id,
                email: email,
                senha: password
            })

            enviar.channel.send(new Discord.MessageEmbed().setTitle(`Sucesso`).setDescription(`Foste registrado com sucesso com o email ${email} e a tua senha é ${password}.`).setColor(bot.cor))

        })   
        colector.on('end', async ()=>{
            setTimeout(async () => {
                await enviar.channel.send(new Discord.MessageEmbed().setTitle(`Registro`).setDescription(`ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ⇢  NINJASTORE   ⇠
                Termos de uso.
            
                Atenção, leita com atentamente para que não há controversas futuras.
            
                1. Registro no website 'https://ninjastore.tk/'.
                    Nosso sistema armanezerá seus dados, não será usado para outros 
                    fins, somente para sua segurança e a nossa.
            
                2. Fraude
                    Está altamente proibida a falsificação de nossos produtos, 
                    sendo cabível a Lei nº 9609/98 de 20 de fevereiro de 1998, 
                    onde declara que os programas de computador ficam incluídos 
                    no âmbito dos direitos autorais, sendo proibidas a reprodução, a cópia, 
                    o aluguel e a utilização de cópias de programas de computador feitas 
                    sem a devida autorização do titular dos direitos autorais.
            
                3. Reembolso:
                De acordo com o Art. 49, O consumidor pode desistir do contrato, 
                no prazo de 7 dias a contar de sua assinatura ou do 
                ato de recebimento do produto ou serviço.
            
                4. Ao aceitar o termo, você concorda que:
                4.1 Não nos responsabilizamos por plugins com maleficios, 
                    abaixe sempre do nosso site oficial.
                4.2 Licenças roubadas ou perdida terá uma taxa de 5$ para recupera-lá.
                4.3 Para novos clientes apartir de 05/08/2020, qualquer plugin 
                    terá a taxa de 5$ para renovação da licença!
            
                                        CLIQUE NO EMOJI ✅ PARA ACEITAR OS TERMOS!
            
            © 2020 NINJASTORE, todos os direitos reservados.`).setColor(bot.cor)).then(msg => {
                msg.react('✅')
                const filter = (reaction, user) => {
                    return reaction.emoji.name === '✅' && user.id === membro.user.id;
                };
                
                const collector = msg.createReactionCollector(filter, { time: 15000 });
                
                collector.on('collect', () => {
                    msg.react('👍')
                    membro.roles.add('730301892814438430')
                    console.log(`[BOT] ${membro.user.username} registrado no discord e no site!`)
                });
            })
    

            }, 5000)
        })
    
    }
})