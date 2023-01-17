const { Client, GatewayIntentBits } = require('discord.js');
const { TOKEN } = require('./bot.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands= require("./commands.js");

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate',(interaction)=>(async () => {
    if (!interaction.isChatInputCommand()) return;
    let command=undefined;
    commands.forEach((c)=>{
      if(c.name===interaction.commandName){
        command=c;
      }
    });
    console.log(interaction.user.username," use command ",interaction.commandName);
    if(command){
      await command.func(client,interaction);
    }
})().catch(e=>console.log));

client.login(TOKEN);