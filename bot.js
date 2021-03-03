const fs = require('fs');
const discord = require('discord.js');
require('./commands/avatar.js');

const { DiscordInteractions, ApplicationCommandOptionType } = require("slash-commands");
const { command } = require('./commands/avatar.js');

const interaction = new DiscordInteractions({
    applicationId: process.env.APPLICATION_ID,
    authToken: process.env.CLIENT_TOKEN,
    publicKey: process.env.PUBLIC_KEY
});

require('dotenv').config();

const client = new discord.Client();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.once('ready', async() => {
    console.log(`Logged in as ${client.user.tag}.`);

    // CREATE
    // await interaction
    //     .createApplicationCommand(command, process.env.GUILD_ID)
    //     .then(console.log)
    //     .catch(console.error);

    // DELETE
    // await interaction
    //     .deleteApplicationCommand("816488933340086312", process.env.GUILD_ID)
    //     .then(console.log("delete guild"))
    //     .catch(console.error);

    // EDIT (AFTER CREATE)
    // await interaction
    //     .createApplicationCommand(command, process.env.GUILD_ID, "command id")
    //     .then(console.log)
    //     .catch(console.error);
});

client.ws.on('INTERACTION_CREATE', async interaction => {
    const command = interaction.data.name.toLowerCase();
    const args = interaction.data.options;
    switch (command) {
        case 'avatart':
            console.log(`${interaction.data.id} = command id`);
            const embed = new discord.MessageEmbed()
                .setImage(`https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}?size=256`)
                .setTimestamp(Date.now())
                .setColor('#0099ff');
            console.log(`${interaction.member.user.id} = ${interaction.member.user.username}`);
            interaction.member.user.dis
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: await createAPIMessage(interaction, embed)
                }
            });
            break;
    }
});

async function createAPIMessage(interaction, content) {
    const apiMessage = await discord.APIMessage.create(client.channels.resolve(interaction.channel_id), content)
        .resolveData()
        .resolveFiles();

    return {...apiMessage.data, files: apiMessage.files };
}

client.login(process.env.CLIENT_TOKEN);