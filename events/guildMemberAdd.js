const { client } = require('../bot.js');
module.exports = async member => {
    const channel = await client.channels.fetch("692231896498962518");
    channel.send(`Welcome to the server, ${(await client.users.fetch('197855949396901888'))}`);
    console.log(member);
};