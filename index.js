const { Client, GatewayIntentBits } = require('discord.js');
const { TOKEN } = require('./bot.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands= require("./commands.js");

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  let command=undefined;
  try{
    commands.forEach((c)=>{
      if(c.name===interaction.commandName){
        command=c;
      }
    });
    
    if(command){
      await command.func(client,interaction);
    }    
  }catch(err){
    console.log(err);
  }
});


client.login(TOKEN);