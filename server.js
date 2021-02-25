const http = require('http');
const querystring = require('querystring');
const discord = require('discord.js');
const client = new discord.Client();
const prefix = "$";
const request = require('request');


http.createServer(function(req, res){
 if (req.method == 'POST'){
   var data = "";
   req.on('data', function(chunk){
     data += chunk;
   });
   req.on('end', function(){
     if(!data){
        console.log("No post data");
        res.end();
        return;
     }
     var dataObject = querystring.parse(data);
     console.log("post:" + dataObject.type);
     if(dataObject.type == "wake"){
       console.log("Woke up in post");
       res.end();
       return;
     }
     res.end();
   });
 }
 else if (req.method == 'GET'){
   res.writeHead(200, {'Content-Type': 'text/plain'});
   res.end('Discord Bot is active now\n');
 }
}).listen(3000);

client.on('ready', message =>{
 console.log('Bot準備完了～');
 // ステータスに ゲームをプレイ中 を表示
    client.user.setActivity('$ping | bit.ly/404bot | Work In Progress!', {
        type: 'WATCHING'
        /*
                'PLAYING': 〇〇 をプレイ中
                'STREAMING': 〇〇 を配信中
                'WATCHING': 〇〇 を視聴中
                'LISTENING': 〇〇 を再生中
        */
    });
});

client.on('message', message => {
  if (message.content === '$ping') {  
    message.channel.send(`🏓 現在の応答速度は ${Date.now() - message.createdTimestamp}msです。`);
  }

//TSからバナー取得
if(message.content.startsWith('\$ts ')) {
  var wtplayername = message.content.replace(/^\$ts /, ''); 
  message.channel.send({
  "embed": {
    "title": ` ${wtplayername}'s Arcade Battle Statistics`,
    "url": `http://thunderskill.com/en/stat/${wtplayername}`,
    "color": 1,
   "image": {
      "url": `http://thunderskill.com/userbars/f/a/${wtplayername}/en-1-combined-a.png`
    }}
});
  
  message.channel.send({
  "embed": {
    "title": ` ${wtplayername}'s Realistic Battle Statistics`,
    "url": `http://thunderskill.com/en/stat/${wtplayername}`,
    "color": 1,
   "image": {
      "url": `http://thunderskill.com/userbars/f/a/${wtplayername}/en-1-combined-r.png`
    }}
});
  message.channel.send({
  "embed": {
    "title": ` ${wtplayername}'s Simulator Battle Statistics`,
    "url": `http://thunderskill.com/en/stat/${wtplayername}`,
    "color": 1,
   "image": {
      "url": `http://thunderskill.com/userbars/f/a/${wtplayername}/en-1-combined-s.png`
    }}
});
  
}
  

  //apexトラッカー
  if(message.content.startsWith('\$apex-pc ')) {
  var apexpcid = message.content.replace(/^\$apex\-pc /, ''); 
  var URL = 'https://public-api.tracker.gg/v2/apex/standard/profile/origin/SSRB_kAKakA';
  var statsdata = request.get({
    uri: URL,
    headers: {'Content-type': 'application/json','TRN-Api-Key' : process.env.APEX_BOT_TOKEN 
    },
    
}, function(err, req, data){
    console.log(err, req, data);
});
  message.channel.send(`${JSON.stringify(statsdata)}`);
}


});




client.on('message', message =>{
 if (message.author.id == client.user.id){
   return;
 }
 if(message.isMemberMentioned(client.user)){
   sendReply(message, "呼びましたか?？");
   return;
 }
 if (message.content.match(/にゃ～ん|ぬーん/)){
   let text = "にゃ～ん";
   sendMsg(message.channel.id, text);
   return;
 }
});



if(process.env.DISCORD_BOT_TOKEN == undefined){
console.log('DISCORD_BOT_TOKENが設定されていません。');
process.exit(0);
}

client.login( process.env.DISCORD_BOT_TOKEN );

function sendReply(message, text){
 message.reply(text)
   .then(console.log("リプライ送信: " + text))
   .catch(console.error);
}

function sendMsg(channelId, text, option={}){
 client.channels.get(channelId).send(text, option)
   .then(console.log("メッセージ送信: " + text + JSON.stringify(option)))
   .catch(console.error);
}

