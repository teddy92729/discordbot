const EventEmitter = require('events');
const eventEmitter = new EventEmitter({ captureRejections: true });
eventEmitter.on("error",(e)=>console.error("Error caught:",e.message));

const { SlashCommandBuilder } = require('discord.js');
const { email, password }     = require("../bot.json");

let ChatGPTAPIBrowser=undefined;
let api=undefined;
let init=false;
let response_list={};
if(!process.env.DEPLOY){
  async function init_f(x){
    ChatGPTAPIBrowser=x.ChatGPTAPIBrowser;
    console.log(`
      USER:${email}
      PSWD:${password}
    `);
    api = new ChatGPTAPIBrowser({
      email: email,
      password: password,
      isGoogleLogin: true
    });
    await api.initSession();
    init=true;
  }
  eventEmitter.on("init",init_f);
  import("chatgpt").then((x)=>eventEmitter.emit("init",x));
}


async function __func(resolve,client,interaction) {
  if (!init)
    resolve(await interaction.reply("Not Initialized"));
  else
    await interaction.reply("...");
  let res = response_list[interaction.user.id];
  if (res) {
    res = await api.sendMessage(interaction.options.getString("prompt"), {
      conversationId: res.conversationId,
      parentMessageId: res.messageId,
      timeoutMs: 120000 //2min
    });
  } else {
    res = await api.sendMessage(interaction.options.getString("prompt"), {
      timeoutMs: 120000 //2min
    });
  }

  console.log(res);
  // await interaction.channel.sendMessage(res.respone);
  await interaction.channel.send(`<@${interaction.user.id}> ` + res.response);
  // await interaction.editReply(interaction.options.getString("prompt"));
  resolve();
}

eventEmitter.on("e",__func);

function main(client,interaction){    
    return new Promise((r)=>eventEmitter.emit("e",r,client,interaction));
}

module.exports=new SlashCommandBuilder()
      .setName("chat")
      .setDescription("send prompt to chatgpt")
      .addStringOption(option =>
        option.setName("prompt")
        .setDescription("prompt")
        .setRequired(true)
        .setMaxLength(2000)
      );

module.exports.func=main;