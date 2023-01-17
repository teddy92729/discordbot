const fs=require("fs");

const { SlashCommandBuilder } = require('discord.js');
const { email, password }     = require("./auth.json");
const { clearanceToken , sessionToken , expire }=require("./auth.json");

let api=undefined;
let init=false;
let response_list={};
if(!process.env.DEPLOY){
  import("chatgpt").then((x)=>(async function(){
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
    console.log(api);
  })().catch(e=>console.log(e)));
}
// function init_chatgpt(){
//   if(!process.env.DEPLOY){
//     import("chatgpt").then((x)=>(async function(){
//         const { ChatGPTAPIBrowser, getOpenAIAuth }=x;
//         console.log(`
//           USER:${email}
//           PSWD:${password}
//         `);
//         let openAIAuth=null;
//         // if(clearanceToken&&sessionToken&&(new Date().getTime()-expire)<7200000){
//         if(clearanceToken&&sessionToken){
//           openAIAuth={
//             userAgent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
//             clearanceToken:clearanceToken,
//             sessionToken:sessionToken
//           };
//         }else{
//           openAIAuth = await getOpenAIAuth({
//             email: email,
//             password: password,
//             isGoogleLogin: true
//           });
//           fs.writeFileSync("./auth.json",JSON.stringify(...require("./auth.json"),...openAIAuth))
//         }

//         console.log(openAIAuth);
//         api=new ChatGPTAPIBrowser({...openAIAuth});
//         await api.initSession();
//         init=true;
//         console.log(api);
//       })().catch(e=>console.log(e)));
//   }  
// };


function main(client,interaction){
    return (async function() {
      if (!init){
        return await interaction.reply("Not Initialized");
      }
        

      let res = response_list[interaction.user.id]||{};
      
      if(res.lock)
        return await interaction.reply("先等等");

      await interaction.reply("...");
      response_list[interaction.user.id]={lock:true};

      if (res.conversationId){
        res = await api.sendMessage(interaction.options.getString("prompt"), {
          conversationId: res.conversationId,
          parentMessageId: res.messageId,
          timeoutMs: 300000 //5min
        });
      } else {
        res = await api.sendMessage(interaction.options.getString("prompt"), {
          timeoutMs: 300000 //5min
        });
      }
      response_list[interaction.user.id]={...res,lock:false};
      console.log(res);
      
      const max_send_length=1800;
      let str=String(res.response);
      await interaction.channel.send(`<@${interaction.user.id}> ` + str.substring(0,max_send_length));
      str=str.substring(max_send_length);
      while(str.length){
        await interaction.channel.send(str.substring(0,max_send_length));
        str=str.substring(max_send_length);
      }
    })().catch((e)=>{
      if(init)response_list[interaction.user.id].lock=false;
      console.log(e.message);
    });
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