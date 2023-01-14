const { REST, Routes } = require('discord.js');
const {TOKEN,CLIENT_ID}=require("./bot.json");

const commands= require("./commands.js");
console.log(commands);

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();