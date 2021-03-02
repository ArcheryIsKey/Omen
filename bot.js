const fs = require('fs');
const discord = require('discord.js');

require('dotenv').config();

const prefix = process.env.PREFIX;

const client = new discord.Client();
client.commands = new discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        command.execute(message, args, client);
    } catch (e) {
        console.error(e);
        message.reply('There was an error trying to execute that command.');
    }
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}.`);
})

client.login(process.env.CLIENT_TOKEN);