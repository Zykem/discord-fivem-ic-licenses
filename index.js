const Discord = require('discord.js');
const client = new Discord.Client({intents: ['GUILD_MEMBERS', 'DIRECT_MESSAGES', 'GUILD_MESSAGES', 'GUILDS']});
const { SlashCommandBuilder} = require('@discordjs/builders')
const mysql =  require('mysql')

var con = mysql.createConnection({

    host: '',
    user: '',
    password: '',
    database: '',
    port: 3306,
    dateStrings: true

})

client.on('message', (message) => { 
    
});

client.on('ready', () => { 
    console.log(`${client.user.username} is online !`);
    client.user.setActivity('Database Menagement', {type: 'WATCHING'});

    con.connect(function(err) {

        if(err) throw err;
        console.log('DB Loaded')

    })

    const guildId = '954667974537666570'
    const guild = client.guilds.cache.get(guildId);
    let commands = guild.commands;

    commands.create({

        name: 'givelicense',
        description: 'Nadaj licencje graczowi',
        options: [


            {

                name: 'steamhex',
                description: 'Podaj SteamHex gracza',
                required: true,
                type: Discord.Constants.ApplicationCommandOptionTypes.STRING

            },
            {

                name: 'licencja',
                description: 'Dostepne Licencje:  heli, sert, seu, weapon, weapon_long',
                required: true,
                type: Discord.Constants.ApplicationCommandOptionTypes.STRING

            }


        ]

    })


});

client.on('interactionCreate', async(interaction) => {

    if(interaction.commandName === 'dajlicencje') {

        let intauthor = interaction.member;

        if(intauthor.id == '960958389112946689' || intauthor.id == '822973525496299601' || intauthor.id == '582117544455045120') {
            let argstrings = con.escape('steam:' + interaction.options.getString('steamhex'))
            let typestring = con.escape(interaction.options.getString('licencja'))


            con.query(`SELECT owner,type FROM user_licenses WHERE owner = ` + argstrings + ' AND type = ' + typestring, function(err, result) {

                if(err) throw err;
                if(result == null || result == '') {    

                    interaction.reply('Nadawanie licencji ' + typestring + ' dla ' + argstrings)
                    con.query(`INSERT INTO user_licenses (type, owner, time, label) VALUES (${typestring}, ${argstrings}, ${con.escape(getRandomInt(1111,9999))}, -1)`, function(err,result) {


                        if(err) throw err;

                    })

                } else {

                    interaction.reply('Ten gracz posiada juz licencje ' + typestring)

                }

            })

        }

    }

})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

client.login('token');