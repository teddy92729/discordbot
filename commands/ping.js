
function main(client,interaction){
    return new Promise(async(r)=>{
      await interaction.reply("Pong!");
      r();
    });
}

module.exports={
    name: "ping",
    description: "Replies with Pong!",
    func:main
};