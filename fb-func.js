exports.fetchfb = function(url){
var request = require("request");
return new Promise(function (fulfil , reject){

  request(url, function(error, response, body) {
    if (error){
      reject('error geting data');
    } else {
      fulfil(body);
    }

  });

});

}
