const discord = require('discord.js');
module.exports = async(client, message) => {
    if (!message.content.startsWith('omen.') || message.author.bot) return;
    const args = message.content.slice('omen.'.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (commandName === "reactionrole") {
        let embed = new discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Choose your roles.')
            .setDescription('Description.')

        let embedMessage = await message.channel.send(embed);
        embedMessage.react('🍎');
        embedMessage.react('🍇');
        embedMessage.react('🍊');
        // TODO: Add emojis to react to for roles. NEED ROLES AND EMOJIS
        // embedMessage.react()
    }

    if (commandName === "jointest") {
        client.emit('guildMemberAdd', message.member.guild.member(message.author));
    }
};