const token = "NTU1NzY4MDUyMDcxOTIzNzUy.XJ-ukA.YkrzW24aCI3osQUWSoM8d8GBf-Q";
const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone : true});
const fs = require("fs")
let xp = require("./xp.json")
let purple = botconfig.purple
bot.commands = new Discord.Collection()

fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err)
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.lenght <= 0){
      console.log("Couldn't find command!")
      return;
    }
  
    jsfile.forEach((f, i) =>{
      let props = require(`./commands/${f}`);
      console.log(`${f} loaded!😀`);
     bot.commands.set(props.help.name, props)
    });
  });

bot.on("ready", () => {
    bot.user.setPresence({
        game: { 
            name: 'Python clan',
            type: 'WATCHING'
        },
        status: "dnd"
    })
  });
  bot.on("message", async message => {
      if(message.author.bot) return;
      if(message.channel.type === "dm") return

    let xpAdd = Math.floor(Math.random() * 7)+ 8;
console.log(xpAdd)

if(!xp[message.author.id]) {
     xp[message.author.id] = {
         xp: 0,
         level:1
     };
}


let curxp = xp[message.author.id].xp
let curlvl = xp[message.author.id].level
let nxtLvl = xp[message.author.id].level * 300
xp[message.author.id].xp = curxp + xpAdd;

if(nxtLvl <= xp[message.author.id].xp){
    xp[message.author.id].level = curlvl + 1;
    message.reply("Поздравляю, ты достиг нового уровня", curlvl + 1)
    

    message.channel.send(lvlup).then(msg => {msg.delete(5000)})

}
fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
    if(err) console.log(err)
})
console.log(`Уровень ${xp[message.author.id].level}`)

      let prefix = botconfig.prefix
      let messageArray = message.content.split(" ");
      let cmd = messageArray[0];
      let args = messageArray.slice(1);

      if(cmd === `${prefix}hello`){
          message.reply("HI")
      }
      if(cmd === `${prefix}report`){
        message.delete();
        let rUser = message.guild.member(message.mentions.users.first() || msd.guild.members.get(args[0]));
        if(!rUser) return message.channel.send("Couldn't find user.");
        let reason = args.join(" ").slice(22);
    
        let reportEmbed = new Discord.RichEmbed()
          .setDescription("Репорт")
          .setColor("#15f152")
          .addField("Репорт пользователь", `${rUser} с ID: ${rUser.id}`)
          .addField("Автор репорта", `${message.author} с ID: ${message.author.id}`)
          .addField("Канал", message.channel)
          .setTimestamp()
          .addField("Причина:", reason);
    
          let reportschannel = message.guild.channels.find(`name`, "reports");
          if(!reportschannel) return message.channel.send("Не найден канал для репортов.");
    
          reportschannel.send(reportEmbed);
          message.member.send("Ваш отчёт был доставлен, это его вид:", reportEmbed)
      }
      if(cmd === `${prefix}level`){
        if(!xp[message.author.id]) {
          xp[message.author.id] = {
              xp:0, 
              level:1
          }
        }
        let curxp = xp[message.author.id].xp
        let curlvl = xp[message.author.id].level
        let nxtlvlxp = curlvl * 300
        let difference = nxtlvlxp - curxp
        
        let lvlEmbed = new Discord.RichEmbed()
        .setAuthor(message.author.username)
        .setColor(purple)
        .addField("Level", curlvl, true)
        .addField("XP", curxp, true)
        .setFooter(`${difference} Осталось XP до след. уровня.` , message.author.displayAvatarURL)
        
        message.channel.send(lvlEmbed).then(msg => {msg.delete(5000)})
        }
      if(cmd === `${prefix}cm`){
        let logchannel = message.guild.channels.find(`name`, "wumpuslog");
        if(!logchannel) return message.channel.send("Не найден wumpuslog канал.");
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
        if(!args[0]) return message.channel.send("oof.");
        message.channel.bulkDelete(args[0]).then(() => {
            logchannel.send(`Удалено ${args[0]} сообщений.`).then(msg => message.delete(5000))
        });
      };
  })
  bot.on("guildMemberAdd", async member => {
    console.log(`${member.id} joined the server.`);

    let welcomechannel = member.guild.channels.find(`name`, "welcome");
    welcomechannel.send(`Смотрите все ${member} присоединился к нашему клану. Что-бы попасть в игровой клан , напиши про себя в apply-here.`);

  });
  bot.on("guildMemberRemove", async member => {
    console.log(`${member.user.username} left the server.`);

    let welcomechannel = member.guild.channels.find(`name`, "welcome_");
    welcomechannel.send(`Удачи!  ${member} вышел из сервера`);

  });
bot.login(token)