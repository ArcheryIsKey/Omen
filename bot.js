const fs = require('fs');
const discord = require('discord.js');
require('./commands/avatar.js');

const { DiscordInteractions, ApplicationCommandOptionType } = require("slash-commands");
const { avatar } = require('./commands/avatar.js');

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
    //     .createApplicationCommand(avatar, process.env.GUILD_ID)
    //     .then(console.log(""))
    //     .catch(console.error);

    // DELETE
    // await interaction
    //     .deleteApplicationCommand("816602024375615508", process.env.GUILD_ID)
    //     .then(console.log("delete guild"))
    //     .catch(console.error);

    // EDIT (AFTER CREATE)
    // await interaction
    //     .createApplicationCommand(command, process.env.GUILD_ID, "command id")
    //     .then(console.log)
    //     .catch(console.error);

});

client.on('message', async message => {
    if (!message.content.startsWith('omen.') || message.author.bot) return;
    const args = message.content.slice('omen.'.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();


    if (commandName === "reactionrole") {
        let embed = new discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Choose your roles.')
            .setDescription('Description.')

        message.channel.send(embed);
        // TODO: Add emojis to react to for roles. NEED ROLES AND EMOJIS
        // embedMessage.react()
    }
});

client.ws.on('INTERACTION_CREATE', async interaction => {
    const command = interaction.data.name.toLowerCase();
    const args = interaction.data.options;
    switch (command) {
        case 'avatar':
            console.log(`${interaction.data.id} = command id`);
            const embed = new discord.MessageEmbed()
                .setImage(`https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}?size=256`)
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
    }
});

async function createAPIMessage(interaction, content) {
    const apiMessage = await discord.APIMessage.create(client.channels.resolve(interaction.channel_id), content)
        .resolveData()
        .resolveFiles();

    return {...apiMessage.data, files: apiMessage.files };
}

client.login(process.env.CLIENT_TOKEN);