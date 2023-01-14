module.exports=[
    {
      name: "ping",
      description: "Replies with Pong!",
      func:function(client,interaction){
          return new Promise(async(r)=>{
            await interaction.reply("FUCK");
            r();
          });
      }
    }
]