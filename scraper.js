const fs = require('fs')
const request = require('request')
var contestSlug=''          //<<<your contest slug goes here>>>
var challengeId=''          //<<<your challenge id goes here>>>
var cookie=''               //<<<your cookie goes here>>>
var x_csrf_token=''         //<<<your x_csrf token goes here>>>
var codeBaseUrl='https://www.hackerrank.com/rest/contests/'+contestSlug+'/submissions/'
var options1 = {
    url: 'https://www.hackerrank.com/rest/contests/'+contestSlug+'/judge_submissions/?offset=0&limit=10000&challenge_id='+challengeId,
    headers: {
      'X-CSRF-Token': x_csrf_token,
      'Cookie': cookie
    }
};
var options2 = {
    url: '',
    headers: {
        'X-CSRF-Token': x_csrf_token,
        'Cookie': cookie
      }
};
function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      //console.log(info.models[info.models.length-1].id)
      getCode(info)
    }
    else{
        console.log(error)
    }
 } 
request(options1, callback);
function getCode(info){
    let count=0
    for(let o=0;o<info.models.length;o++){
        if(info.models[o].status == 'Accepted'){
            count++
            writeToFile(info.models[o].id,info.models[o].hacker_username)
        }
    }
    fs.writeFileSync('count.txt',count)
    //console.log('count:'+count)
}
function writeToFile(id,username){
    options2.url=codeBaseUrl+id
    function callback(error,response,body){
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            fs.writeFileSync(username+'.c',info.model.code)
          }
          else{
              console.log(error)
          }
    }
    request(options2,callback)
}
