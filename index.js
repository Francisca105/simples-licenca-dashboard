require('dotenv').config();
//BOT

const discord = require("discord.js")
const bot = new discord.Client()
bot.cor = "#eda41c"
bot.commands = new discord.Collection();
bot.aliases = new discord.Collection();

module.exports = bot

const { loadCommands, loadEvents } = require("./bot/utils/handler")
loadCommands()
loadEvents()

bot.login(process.env.TOKEN)

//SITE

const express = require('express');
const session = require('express-session');
const path = require('path')
const Licencas = require('./db/Licenças')
const Users = require('./db/Usuarios');

const app = express()
app.set('view-engine', 'ejs')

app.use(express.urlencoded({ extended: false }))

app.use('/', express.static('./public'))
app.use('/remove', express.static('./public'))
app.use('/editar', express.static('./public'))
app.use('/admin', express.static('./public'))

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.get('/', naoAutenticado , async (req, res) => {
    if(req.session.admin) {
        res.redirect('/admin')
    } else {
        res.redirect('/index')
    }
})

app.get('/login', Autenticado , (req, res) => {
    res.render('login.ejs', {message: null})
})

app.get('/index', naoAutenticado , async (req, res) => {
    let findL = await Licencas.findAll({
        where:{
            email: req.session.email
        },
        attributes: ['id', 'email', 'plugin', 'licenca', 'ip']
    })

    //console.log(findL)
    
    let mapa = findL.map(f => {

        let dados = f.dataValues
        //console.log(dados)
        let json = {
            id: dados.id,
            email: dados.email,
            plugin: dados.plugin, 
            licenca: dados.licenca,
            ip: dados.ip
        }
        return json

    })

    //console.log(mapa)
    
    res.render('index.ejs', {nome: req.session.name, plugins: req.session.plugins, gastos: req.session.gastos, dados: mapa})
})

app.get('/add', naoAutenticado , (req, res) => {
    if(req.session.admin) {
        res.render('add.ejs', {nome: req.session.name, erro: null})
    } else {
        res.redirect('/index')
    }
})

app.get('/remove', naoAutenticado , (req, res) => {
    if(req.session.admin) {
        res.render('remove.ejs', {nome: req.session.name, erro: null})
    } else {
        res.redirect('/index')
    }
})

app.get('/logout', naoAutenticado, async (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

app.get('/editar/:id', naoAutenticado , async (req, res) => {
    
    let id = req.params.id
    let findI = await Licencas.findOne({where:{
        id: id
    }})
    

    if(findI) {
        if(req.session.email !== findI.email && req.session.admin === false) res.redirect('/')
        res.render('editar.ejs', {nome: req.session.name, plugin: findI.plugin ,erro: null, id: id})
    } else {
        res.render('editar.ejs', {nome: req.session.name, plugin: 'ERRO' ,erro: 'Não encontrei essa licença.', id: id})
    }
    
})

app.get('/remove/:id', naoAutenticado, async (req, res) => {
    if(req.session.admin) {

    let id = req.params.id;
    
    let findI = await Licencas.findOne({where:{
        id: id
    }})
    if(findI) {
        findI.destroy().catch(e => {
            res.render('remove.ejs', {nome: req.session.name, erro: e})
        })
        res.render('remove.ejs', {nome: req.session.name, erro: 'Deletado com sucesso.'})
    } else {
        res.render('remove.ejs', {nome: req.session.name, erro: 'Id não encontrado'})
    }
    } else {
        res.redirect('/index')
    }
})

app.get('/admin', naoAutenticado, async (req, res) => {
    if(req.session.admin) {

    let findL = await Licencas.findAll({attributes: ['id', 'email', 'plugin', 'licenca', 'ip']})
    //console.log(findL)
    
    let mapa = findL.map(f => {

        let dados = f.dataValues
        //console.log(dados)
        let json = {
            id: dados.id, 
            email: dados.email, 
            plugin: dados.plugin, 
            licenca: dados.licenca,
            ip: dados.ip
        }
        return json

    })

        res.render('admin.ejs', {dados: mapa, nome: req.session.name, busca: null})

    } else {
        res.redirect('/index')
    }
})

app.get('/admin/:id', naoAutenticado, async (req, res) => {
    if(req.session.admin) {
        let id = req.params.id
        if(id){
        //console.log(id)

        let findU = await Users.findOne({where:{
            id: id
        }})
        if(!findU) res.redirect('/admin')
        //console.log(findU.email)
    let findL = await Licencas.findAll({where:{email: findU.email}}/*, {attributes: ['id', 'email', 'plugin', 'licenca', 'ip']}*/)
    
    let mapa = findL.map(f => {

        let dados = f.dataValues

        let json = {
            id: dados.id, 
            email: dados.email, 
            plugin: dados.plugin, 
            licenca: dados.licenca,
            ip: dados.ip
        }
        return json

    })

        res.render('admin.ejs', {dados: mapa, nome: req.session.name, busca: findU.email})

    } else {
        res.redirect('/index')
    }}
})


app.get('*', (req, res) => {
    res.status(404).render('404.ejs')
});

app.post('/login', async (req, res) => {
    let email = req.body.email,
        password = req.body.password

        if(email && password) {
            let findE = await Users.findOne({where:{
                email: email
            }})
            if(!findE) {
                return res.render('login.ejs', {message: 'O email não está cadastrado no site.'})
            }
            let Upass = findE.senha
            if(password !== Upass) {
                return res.render('login.ejs', {message: 'Senha incorreta.'})
            }
            req.session.loggedin = true;
            req.session.email = email;
            req.session.id = findE.id
            req.session.gasto = findE.gasto || 0
            req.session.plugins = findE.plugins || 0
            req.session.admin = findE.admin || false
            req.session.name = bot.users.cache.get(findE.id).username || 'Desconhecido'

            //console.log(req.session)

            res.redirect('/');
        } else {
            res.render('login.ejs', {message: 'Preenche os campos todos.'})
        }
})

app.post('/add', async (req,res) =>{
    let preço = req.body.preco,
        plugin = req.body.plugin,
        email = req.body.email

        function lic(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
         }
    
        let gerador = lic(20)

        if(!preço || !plugin || !email) {
            res.render('add.ejs', {nome: req.session.name, erro: 'Preencha todos os campos.'})
        } else {

            let findE = await Users.findOne({where:{
                email: email
            }})

            if(!findE) res.render('add.ejs', {nome: req.session.name, erro: 'Esse email não está cadastrado.'})
            await findE.increment({ gasto: preço, plugins: 1})

            await Licencas.create({
                email: email,
                plugin: plugin,
                licenca: gerador,
                ip: '0.0.0.0'
            })

            res.render('add.ejs', {nome: req.session.name, erro: 'Criado com sucesso.'})
        }
})

app.post('/editar/:id', async (req,res) =>{
    let id = req.params.id
    let ip = req.body.ip

    if(!ip) res.render('editar.ejs', {nome: req.session.name, plugin: findI.plugin ,erro: 'Preencha os campos todos.', id: id})

    let findI = await Licencas.findOne({where:{
        id: id
    }})
    if(findI) {
        await Licencas.update({ip: ip}, {where: {id: id}})
        res.redirect('/')
    } else {
        res.render('editar.ejs', {nome: req.session.name, plugin: findI.plugin ,erro: 'Licença não encontrada', id: id})
    }
})

app.post('/remove', async (req,res) =>{
    let id = req.body.id


        if(!id) {
            res.render('remove.ejs', {nome: req.session.name, erro: 'Preencha todos os campos.'})
        } else {

            let findI = await Licencas.findOne({where:{
                id: id
            }})
            if(findI) {
                findI.destroy();
                res.render('remove.ejs', {nome: req.session.name, erro: 'Deletado com sucesso.'})
            }
            else {
                res.render('remove.ejs', {nome: req.session.name, erro: 'Essa licença não existe.'})
            }
        }
})

app.post('/admin', async (req, res) => {
    let email = req.body.email
    let findE = await Users.findOne({where:{
        email: email
    }})

    if(findE) {
        let id = findE.id
        res.redirect(`/admin/${id}`)
    } else {
        res.redirect('/admin')
    }
})

app.listen(3000, ()=>{
    console.log('[SITE] Conectado na porta 3000 com sucesso!')
})


function naoAutenticado (req, res, next) {
    if(req.session.loggedin === true) {
        return next()
    } else {
        res.redirect('/login')
    }
}

function Autenticado (req, res, next) {
    if(req.session.loggedin === true) {
        return res.redirect('/')
    } else {
        next()
    }
}