const { SlashCommandBuilder } = require('discord.js');


function main(client,interaction){
    return (async()=>{
      console.log("...........");
      await interaction.reply("Hello World");
    })().catch(e=>{

    });
}

module.exports=new SlashCommandBuilder()
      .setName("template")
      .setDescription("just template");

module.exports.func=main;