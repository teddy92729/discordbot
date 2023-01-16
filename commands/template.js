const EventEmitter = require('events');
const { SlashCommandBuilder } = require('discord.js');


function main(client,interaction){
    const eventEmitter = new EventEmitter({ captureRejections: true });
    const __func=async(resolve)=>{
      console.log("...........");
      await interaction.reply("Hello World");
      resolve();
    };
    eventEmitter.on("interaction",__func);
    eventEmitter.on("error",(e)=>console.error("Error caught:",e.message));
    return new Promise((r)=>eventEmitter.emit("interaction",r));
}

module.exports=new SlashCommandBuilder()
      .setName("template")
      .setDescription("just template");

module.exports.func=main;