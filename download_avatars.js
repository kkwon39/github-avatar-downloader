var args = process.argv.slice(2);

var request = require('request');
var secret = require('./secrets.js');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  if(!args[0] || !args[1]){
    console.log("Both arguments were not present");
    return;
  }


  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization' : `token ${secret.GITHUB_TOKEN}`
    }
  };

  request(options, function(err, res, body) {
  var str = JSON.parse(body);
    cb(err, str);
  });
}

function downloadImageByURL(url, filePath) {
      var fs = require('fs');
      var request = require('request');
      request.get(url)
       .on('error', function (err) {
         throw err;
       })
       .on('response', function (response) {
         console.log('Response Status Code: ', response.statusCode);
         console.log('Downloading image...');
       })
       .pipe(fs.createWriteStream(filePath))
       .on('finish', function(){
        console.log('Done downloading image!')
        });
}



getRepoContributors(args[0], args[1], function(err, result) {

    for (var i = 0 ; i < result.length; i++){
      var filePath = result[i].login + ".jpg";
      downloadImageByURL(result[i].avatar_url, filePath);

    }
  console.log("Errors:", err);
  console.log("Result:", result);

});