const http = require("http");
const querystring = require("querystring");
const discord = require("discord.js");
const client = new discord.Client();
const prefix = "$";
const request = require("request");

http
  .createServer(function (req, res) {
    if (req.method == "POST") {
      var data = "";
      req.on("data", function (chunk) {
        data += chunk;
      });
      req.on("end", function () {
        if (!data) {
          console.log("No post data");
          res.end();
          return;
        }
        var dataObject = querystring.parse(data);
        console.log("post:" + dataObject.type);
        if (dataObject.type == "wake") {
          console.log("Woke up in post");
          res.end();
          return;
        }
        res.end();
      });
    } else if (req.method == "GET") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Discord Bot is active now\n");
    }
  })
  .listen(3000);

client.on("ready", (message) => {
  console.log("Bot準備完了～");
  // ステータスに ゲームをプレイ中 を表示
  client.user.setActivity("$help | bit.ly/404bot | Work In Progress!", {
    type: "WATCHING",
    /*
                'PLAYING': 〇〇 をプレイ中
                'STREAMING': 〇〇 を配信中
                'WATCHING': 〇〇 を視聴中
                'LISTENING': 〇〇 を再生中
        */
  });
});

client.on("message", (message) => {
  if (message.content === "$ping") {
    message.channel.send(
      `🏓 現在の応答速度は ${Date.now() - message.createdTimestamp}msです。`
    );
  }
  if (message.content === "$help") {
    message.channel.send(
      `🏓 現在の応答速度は ${Date.now() - message.createdTimestamp}msです。`
    );
    message.channel.send({
      embed: {
        title: "404managerBOT commands",
        description:
          "**THIS BOT IS WORK IN PROGRESS!**  [GitHub](https://github.com/kakaka082/404nf_squadron_managerbot)",
        color: 16293400,
        timestamp: `${Date.now()}`,

        fields: [
          {
            name: "Ping",
            value: "`$ping`\nMeasure the response time.",
          },
          {
            name: "ThunderSkill stats",
            value:
              "`$ts [Player Name]`\nGet WarThunder player data from ThunderSkill.",
          },
          {
            name: "Squadron profile",
            value:
              "`$ts [Squadron full name]`\nLowercase, uppercase, spaces, and symbols are all distinguished.",
          },
        ],
      },
    });
  }

  //TSからバナー取得
  if (message.content.startsWith("$ts ")) {
    var wtplayername = message.content.replace(/^\$ts /, "");
    message.channel.send({
      embed: {
        title: ` ${wtplayername}'s Arcade Battle Statistics`,
        url: `http://thunderskill.com/en/stat/${wtplayername}`,
        color: 1,
        image: {
          url: `http://thunderskill.com/userbars/f/a/${wtplayername}/en-1-combined-a.png`,
        },
      },
    });
    message.channel.send({
      embed: {
        title: ` ${wtplayername}'s Realistic Battle Statistics`,
        url: `http://thunderskill.com/en/stat/${wtplayername}`,
        color: 1,
        image: {
          url: `http://thunderskill.com/userbars/f/a/${wtplayername}/en-1-combined-r.png`,
        },
      },
    });
    message.channel.send({
      embed: {
        title: ` ${wtplayername}'s Simulator Battle Statistics`,
        url: `http://thunderskill.com/en/stat/${wtplayername}`,
        color: 1,
        image: {
          url: `http://thunderskill.com/userbars/f/a/${wtplayername}/en-1-combined-s.png`,
        },
      },
    });

    message.channel.send({
      embed: {
        title: "War Thunder profile on Web",
        url: `https://warthunder.com/en/community/userinfo/?nick=${wtplayername}`,
        color: 13079036,
        image: {
          url: "https://cdn.discordapp.com/attachments/749350112849035264/885780613133647892/logo-warthunder.png",
        },
        fields: [
          {
            name: "nyan nyan",
            value: `${wtplayername}`,
            inline: true,
          },
        ],
      },
    });
  }

  //squadron
  if (message.content.startsWith("$sq ")) {
    var squad = message.content.replace(/^\$sq /, "");
    squad = squad.replace(/\s+/g, "+");
    message.channel.send(
      `https://warthunder.com/en/community/claninfo/${squad}`
    );
  }

  //sqb_manage
  if (message.content.startsWith("$sqb")) {
    if (message.member.voice.channel == null) {
      message.channel.send("あなたはVCに居ません！/You're not in the VC.");
    } else {
      var VCID = message.member.voice.channel;
      message.channel.send(VCID);
      VCID.members.forEach((member) => {
        message.channel.send("<@" + member.id + ">");
      });
      const authIcon = message.author.avatarURL();
      const authName = message.author.username;
      const embed = {
        title:
          "次の試合で使用する車種にリアクションしてください / React to the vehicle type you will use in the next game.",
        description:
          "最大スポーン数　空(ヘリコプターを含む):4 陸:8 [合計8スポーン] / Maximum number of spawns Air (including helicopters): 4 Ground: 8 [Total: 8 spawns]",
        color: 16635441,
        thumbnail: {
          url: "https://cdn.discordapp.com/attachments/749350112849035264/929093182757670932/sqb1.png",
        },
        author: {
          name: authName,
          icon_url: authIcon,
        },
        fields: [
          {
            name: "💥",
            value:
              "制空戦闘機 / Air superiority fighters\n-----------------------",
          },
          {
            name: "💣",
            value:
              "対地攻撃機 / Ground attack aircraft\n-----------------------",
          },
          {
            name: "🚁",
            value: "攻撃ヘリ / Attack helicopter\n-----------------------",
          },
          {
            name: "🪖",
            value: "戦車 / Tank\n-----------------------",
          },
          {
            name: "🏹",
            value: "対空戦車 / SPAA",
          },
        ],
      };
      message.channel.send({ embed }).then(embedMessage => {
    embedMessage.react("💥")
    embedMessage.react("💣")
    embedMessage.react("🚁")
    embedMessage.react("🪖")
    embedMessage.react("🏹")
        
});
      
    }
  }

  //apexトラッカー
  if (message.content.startsWith("$apex-pc ")) {
    var apexpcid = message.content.replace(/^\$apex\-pc /, "");
    var URL = "https://public-api.tracker.gg/v2/apex/standard/profile/origin/";
    var statsdata = request.get(
      {
        uri: URL,
        headers: {
          "Content-type": "application/json",
          "TRN-Api-Key": process.env.APEX_BOT_TOKEN,
        },
      },
      function (err, req, data) {
        console.log(err, req, data);
      }
    );
    message.channel.send(`${JSON.stringify(statsdata)}`);
  }
});

if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.log("DISCORD_BOT_TOKENが設定されていません。");
  process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);

function sendReply(message, text) {
  message
    .reply(text)
    .then(console.log("リプライ送信: " + text))
    .catch(console.error);
}

function sendMsg(channelId, text, option = {}) {
  client.channels
    .get(channelId)
    .send(text, option)
    .then(console.log("メッセージ送信: " + text + JSON.stringify(option)))
    .catch(console.error);
}
