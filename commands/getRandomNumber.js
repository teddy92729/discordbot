const { SlashCommandBuilder } = require('discord.js');

function main(client,interaction){
    return new Promise(async(r)=>{
      let max=interaction.options.getInteger("max");
      let min=interaction.options.getInteger("min");
      function getRandomInt() {
        return Math.floor(Math.random() * (max-min)+min);
      }
      await interaction.reply(`Random Number is ${getRandomInt()}`);
      r();
    });
}

module.exports=new SlashCommandBuilder()
      .setName("get_random_number")
      .setDescription("Get random number.")
      .addIntegerOption(option =>
        option.setName("max")
        .setDescription("Max number")
        .setRequired(true)
      )
      .addIntegerOption(option =>
        option.setName("min")
        .setDescription("Min number")
        .setRequired(true)
);
module.exports.func=main;