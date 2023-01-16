function main(client,interaction){
    return new Promise(async(r)=>{
      await interaction.reply(`Your Discord ID is ${interaction.user.id}`);
      r();
    });
}

module.exports={
    name: "get_my_id",
    description: "Show your Discord ID",
    func:main
};