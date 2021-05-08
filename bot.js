const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const fs = require("fs");
const moment = require("moment");
const Jimp = require("jimp");
const db = require("quick.db");
const spamayarlar = require("./spam-koruma-ayarları.json");
const token = process.env.token;
var prefix = process.env.prefix;

client.on("ready", () => {
  console.log(`Bot suan bu isimle aktif: ${client.user.tag}!`);
});

const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

///////////// KOMUTLAR BAŞ

client.on("message", msg => {
 if(!db.has(`reklam_${msg.guild.id}`)) return;
        const reklam = [".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", "net", ".rf.gd", ".az", ".party", "discord.gg",];
        if (reklam.some(word => msg.content.includes(word))) {
          try {
            if (!msg.member.hasPermission("BAN_MEMBERS")) {
                  msg.delete();
                    return msg.reply('**Bu Sunucuda** `Reklam Engelle`** Aktif Reklam Yapmana İzin Vermem İzin Vermem ? !**').then(msg => msg.delete(3000));
   
 
  msg.delete(3000);                              
 
            }              
          } catch(err) {
            console.log(err);
          }
        }
    });

/////////////////////////

client.on("message", async msg => {
  
  
 const i = await db.fetch(`kufur_${msg.guild.id}`)
    if (i == "acik") {
        const kufur = ["oç", "amk", "ananı sikiyim", "ananıskm", "piç", "amk", "amsk", "sikim", "sikiyim", "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "mal", "sik", "yarrak", "am", "amcık", "amık", "yarram", "sikimi ye", "mk", "mq", "aq", "ak", "amq",];
        if (kufur.some(word => msg.content.includes(word))) {
          try {
            if (!msg.member.hasPermission("BAN_MEMBERS")) {
                  msg.delete();
                          
                      return msg.reply('Bu Sunucuda Küfür Filtresi Aktiftir.')
            }              
          } catch(err) {
            console.log(err);
          }
        }
    }
    if (!i) return;
});

client.on("messageUpdate", (oldMessage, newMessage) => {
  
  
 const i = db.fetch(`${oldMessage.guild.id}.kufur`)
    if (i) {
        const kufur = ["oç", "amk", "ananı sikiyim", "ananıskm", "piç", "amk", "amsk", "sikim", "sikiyim", "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "mal", "sik", "yarrak", "am", "amcık", "amık", "yarram", "sikimi ye", "mk", "mq", "aq", "ak", "amq",];
        if (kufur.some(word => newMessage.content.includes(word))) {
          try {
            if (!oldMessage.member.hasPermission("BAN_MEMBERS")) {
                  oldMessage.delete();
                          
                      return oldMessage.reply('Bu Sunucuda Küfür Filtresi Aktiftir.')
            }              
          } catch(err) {
            console.log(err);
          }
        }
    }
    if (!i) return;
});

/////////////////// ROL KORUMA //////////////////////////////

client.on('guildMemberUpdate', async (oldMember, newMember) => {
let guild = oldMember.guild || newMember.guild;
  
    let chimp = await guild.fetchAuditLogs({type: 'MEMBER_ROLES_UPDATE'});
  
    if(chimp) {
      
let asd = []

oldMember.roles.cache.forEach(c => {
if(!newMember.roles.cache.has(c.id)) {
require('quick.db').delete(`${guild.id}.${c.id}.${oldMember.id}`)
}
})
newMember.roles.cache.forEach(c => {
if(!oldMember.roles.cache.has(c.id)) {
require('quick.db').set(`${guild.id}.${c.id}.${newMember.id}`, 'eklendi')
}
  
})
    
    }
})

client.on('roleDelete', async role => {
let guild = role.guild;
  
  let e = await guild.fetchAuditLogs({type: 'ROLE_DELETE'});
  let member = guild.members.cache.get(e.entries.first().executor.id);
  //if(member.hasPermission("ADMINISTRATOR")) return;
        
  let mention = role.mentionable;
  let hoist = role.hoist;
  let color = role.hexColor;
  let name = role.name;
  let perms = role.permissions;
  let position = role.position;
  role.guild.roles.create({
    name: name,
    color: color,
    hoist: hoist,
    position: position,
    permissions: perms,
    mentionable: mention
  }).then(async rol => {
    
  guild.members.cache.forEach(async u => {
  const dat = await require('quick.db').fetch(`${guild.id}.${role.id}.${u.id}`)
  if(dat) {

  guild.members.cache.get(u.id).roles.add(rol.id)
  }
    
  })
client.channels.cache.get(ayarlar.rolKorumaLogKanalID).send(new Discord.MessageEmbed().setAuthor(guild.name, guild.iconURL()).setTitle(`Bir rol silindi!`)
.setDescription(`${rol.name} isimli rol ${member} tarafından silindi ve bende tekrardan rolü oluşturdum, önceden role sahip olan tüm kişilere rolü geri verdim.`))
  })
  
})


/////////////////// ROL KORUMA //////////////////////////////

////////////////// EMOJİ KORUMA ////////////////////////////

client.on("emojiDelete", async (emoji, message) => {
  
  let kanal = await db.fetch(`emotek_${emoji.guild.id}`);
  if (!kanal) return;
  
  const entry = await emoji.guild.fetchAuditLogs({ type: "EMOJI_DELETE" }).then(audit => audit.entries.first());
  if (entry.executor.id == client.user.id) return;
  if (entry.executor.id == emoji.guild.owner.id) return;
  if (!emoji.guild.members.cache.get(entry.executor.id).hasPermission('ADMINISTRATOR')) {
    
  emoji.guild.emojis.create(`${emoji.url}`, `${emoji.name}`).catch(console.error);
    
   let embbed = new Discord.MessageEmbed()
   .setColor('RANDOM')
   .setTitle(`Bir Emoji Silindi`)
   .setDescription(`Silinen Emoji: ${emoji.name}, Emoji Koruma Sistemi Açık Olduğundan Tekrar Eklendi!`)
   client.channels.cache.get(kanal).send(embbed)
  
  }

});

////////////////// EMOJİ KORUMA ////////////////////////////

///////////////// KANAL KORUMA /////////////////////////////

client.on("channelDelete", async channel => {
  const logs = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_DELETE' }).then(audit => audit.entries.first())
  const deleter = await channel.guild.members.cache.get(logs.executor.id);
  if(deleter.hasPermission("ADMINISTRATOR")) return; 
  channel.clone(undefined, true, true, "Kanal silme koruması sistemi").then(async klon => {
    
    let guild = channel.guild;
    let logs = guild.channels.cache.find(ch => ch.id === ayarlar.kanalKorumaLogKanalID);
    
    const embed = new Discord.MessageEmbed()
      .setDescription(`Silinen Kanal: <#${klon.id}> (Yeniden oluşturuldu!)\nSilen Kişi: ${deleter.user}`)
      .setColor('RED')
      .setAuthor(deleter.user.tag, deleter.user.displayAvatarURL())
      logs.send(embed);
    
    await klon.setParent(channel.parent);
    await klon.setPosition(channel.position);
  })
})


///////////////// KANAL KORUMA /////////////////////////////

///////////////// DDOS KORUMA /////////////////////////////

client.on('message', msg => {

if(client.ws.ping > 2500) {

            let bölgeler = ['singapore', 'eu-central', 'india', 'us-central', 'london',
            'eu-west', 'amsterdam', 'brazil', 'us-west', 'hongkong',
            'us-south', 'southafrica', 'us-east', 'sydney', 'frankfurt',
            'russia']
           let yenibölge = bölgeler[Math.floor(Math.random() * bölgeler.length)]
           let sChannel = msg.guild.channels.cache.find(c => c.id === ayarlar.ddosKorumaLogKanalID)

           sChannel.send(`Sunucu'ya Saldırı Oluyor \nSunucu Bölgesini Değiştirdim \n __**${yenibölge}**__ \n __**Sunucu Pingimiz**__ :`+ client.ws.ping)
           msg.guild.setRegion(yenibölge)
           .then(g => console.log(" bölge:" + g.region))
           .then(g => msg.channel.send("bölge **"+ g.region  + " olarak değişti"))
           .catch(console.error);
}});

///////////////// DDOS KORUMA /////////////////////////////

//////////////// SPAM KORUMA ///////////////////////

const antispam = require("discord-anti-spam-tr");

antispam(client, {
  uyarmaSınırı: spamayarlar.uyarmaSınırı,
  banlamaSınırı: spamayarlar.banlamaSınırı,
  aralık: spamayarlar.aralık,
  uyarmaMesajı: spamayarlar.uyarmaMesajı,
  rolMesajı: spamayarlar.muteMesajı,
  maxSpamUyarı: spamayarlar.maxSpamUyarı,
  maxSpamBan: spamayarlar.maxSpamBan,
  zaman: spamayarlar.zaman,
  rolİsimi: spamayarlar.rolİsimi
});

//////////////// SPAM KORUMA ///////////////////////

//////////////// ANTİ RAİD /////////////////////

client.on("guildMemberAdd", async member => {
let kanal = await db.fetch(`antiraidK_${member.guild.id}`)== "anti-raid-aç"
  if (!kanal) return;  
  var noples = member.guild.owner
  if (member.user.bot === true) {
     if (db.fetch(`botizin_${member.guild.id}.${member.id}`) == "aktif") {
    let abi = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setThumbnail(member.user.avatarURL())
      .setDescription(`**${member.user.tag}** (${member.id}) adlı bota bir yetkili verdi eğer kaldırmak istiyorsanız **${prefix}bot-izni kaldır botun_id**.`);
    noples.send(abi);
     } else {
       let izinverilmemişbot = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setThumbnail(member.user.avatarURL())
      .setDescription("**" + member.user.tag +"**" + " (" + member.id+ ") " + "adlı bot sunucuya eklendi ve banladım eğer izin vermek istiyorsanız **" + prefix + "bot-izni ver botun_id**")
       member.members.kick();
       noples.send(izinverilmemişbot)
}
  }
});

//////////////// ANTİ RAİD /////////////////////

////////////// KOMUTLAR SON
////////////// ALTI ELLEME
require("./util/eventLoader")(client);


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (ayarlar.sahip.includes(message.author.id)) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(token);
