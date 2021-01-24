var key = "process.env.TRN_TOKEN";
 
function getApexTrack(member) {
  var trackUrl = member.trackUrl;
   
  var params={
    headers:{
      "TRN-API-KEY":key
    },
    method:"get"
  };
   
  var res = UrlFetchApp.fetch(trackUrl,params);
   
  //Logger.log(res);
  return JSON.parse(res);
}