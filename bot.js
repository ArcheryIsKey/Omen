const fs = require('fs');
const fsp = require('fs').promises;
const discord = require('discord.js');
const path = require('path');

const { DiscordInteractions, ApplicationCommandOptionType } = require("slash-commands");
const { avatar } = require('./commands/avatar.js');
const { ping } = require('./commands/ping.js');

const interaction = new DiscordInteractions({
    applicationId: process.env.APPLICATION_ID,
    authToken: process.env.CLIENT_TOKEN,
    publicKey: process.env.PUBLIC_KEY
});

require('dotenv').config();

const client = new discord.Client();

client.once('ready', async() => {
    console.log(`Logged in as \x1b[36m${client.user.tag}\x1b[0m.`);
    await interaction.createApplicationCommand(ping, process.env.GUILD_ID);
    await interaction.createApplicationCommand(avatar, process.env.GUILD_ID);

    await interaction
        .getApplicationCommands(process.env.GUILD_ID).then(command => {
            var i = 0;
            for (i = 0; i <= command.length - 1; i++) {
                console.log(`Command loaded: \x1b[33m${command[i].name} \x1b[37m${command[i].id}\x1b[0m`)
            }
        })

    // await interaction.deleteApplicationCommand('816854454955540570', process.env.GUILD_ID);

    // CREATE
    // await interaction
    //     .createApplicationCommand(ping, process.env.GUILD_ID)
    //     .then(console.log(`Command loaded: \x1b[32m${ping}\x1b[0m`))
    //     .catch(console.error(`\x1b[31mThere was an error loading: \x1b[1m${ping}\x1b[0m.`));

    // DELETE
    // await interaction
    //     .deleteApplicationCommand("816602024375615508", process.env.GUILD_ID)
    //     .then(console.log("delete guild"))
    //     .catch(console.error);

    await registerEvents(client, './events')
});

client.ws.on('INTERACTION_CREATE', async interaction => {
    const command = interaction.data.name.toLowerCase();
    const args = interaction.data.options;
    switch (command) {
        case 'avatar':
            console.log(`${interaction.data.id} = command id`);
            const embed = new discord.MessageEmbed()
                .setImage((await client.users.fetch(interaction.member.user.id)).avatarURL({ dynamic: true, size: 256 }))
                .setTimestamp(Date.now())
                .setColor('#0099ff');
            console.log(`${interaction.member.user.id} = ${interaction.member.user.username}#${interaction.member.user.discriminator}`);
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: await createAPIMessage(interaction, embed)
                }
            });
            break;
        case 'ping':
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 3,
                    data: await createAPIMessage(interaction, `API Latency is ${Math.round(client.ws.ping)}ms`)
                }

            });
    }
});

async function createAPIMessage(interaction, content) {
    const apiMessage = await discord.APIMessage.create(client.channels.resolve(interaction.channel_id), content)
        .resolveData()
        .resolveFiles();

    return {...apiMessage.data, files: apiMessage.files };
}

async function registerEvents(client, dir) {
    let files = await fsp.readdir(dir);
    for (let file of files) {
        let stat = await fsp.lstat(path.join(__dirname, dir, file));
        if (stat.isDirectory()) registerEvents(client, path.join(dir, file));
        else {
            if (file.endsWith(".js")) {
                let eventName = file.substring(0, file.indexOf(".js"));
                try {
                    let eventModule = require(path.join(__dirname, dir, file));
                    client.on(eventName, eventModule.bind(null, client));
                    console.log(`Event loaded: \x1b[32m${eventName}.js\x1b[0m`);
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }
}

module.exports = { client };

client.login(process.env.CLIENT_TOKEN);