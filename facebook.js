var web = require('express');
var bodyParser = require('body-parser'); //geting the medileware that parse the post
var validator = require('validator');
const formidable = require('express-formidable');
//using underscore labrry
var _ = require('underscore');
var app = web();
var port = process.env.PORT || 3000;
var ECT = require('ect');
var ectRenderer = ECT({ watch: true, root: __dirname + '/views', ext: '.ect' });
var url = "https://graph.facebook.com/v2.8/";
var query = " ";
var token = require('./config.js');
var path = require('path');
var mamonfetcher = require('./fb-func');
app.use(web.static(path.join(__dirname, 'r32')));
app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);
process.setMaxListeners(0);
app.use(formidable()); //working with post request
/*
req.fields; // contains non-file fields
 req.files; // contains files
*/
app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);


app.get('/fb', function(input, output) {
    output.header("Content-Type", "application/json; charset=utf-8");
    mamonfetcher.fetchfb(url + query + token).then(function(data) {
        var jsonObject = JSON.parse(data);
        output.json(jsonObject.feed);
    }, function(eror) {
        output.json({ "error": "page problem" });

    });

});

app.get('/fb2', function(input, output) {
    //output.header("Content-Type", "application/json; charset=utf-8");

    var url = "https://graph.facebook.com/v2.8/202409816773047?fields=";
    request(url, function(error, response, body) {
        var jsonObject = JSON.parse(body);

        output.render('index', jsonObject.feed);
    });


});



app.get('/', function(input, output) {
    //output.header("Content-Type", "application/json; charset=utf-8");
    var all = {
      obj : {
        feed: null,
        slide: null,
        cover: null,
	video:null
}
    };
  //  output.header("Content-Type", "application/json; charset=utf-8");

    mamonfetcher.fetchfb(url + query + token).then(function(data) {
        var jsonObject = JSON.parse(data);
        all.obj.feed = jsonObject.feed;
        mamonfetcher.fetchfb(url + "364881?fields=photos.limit(10){permalink_url,images}" + token).then(function(data) {
            var jsonObject = JSON.parse(data);
            all.obj.slide = jsonObject.photos;

      mamonfetcher.fetchfb(url + "2073047?fields=videos.limit(6)%7Bdescription%2Cpermalink_url%7D" + token).then(function(data) {
            var jsonObject2 = JSON.parse(data);
            all.obj.video = jsonObject2.videos;

         console.log(all.obj.video.data);

            mamonfetcher.fetchfb(url + "773047?fields=cover" + token).then(function(data) {
                var jsonObject = JSON.parse(data);
                all.obj.cover = jsonObject.cover;
              //  output.json(all.obj.feed.data);

              //console.log(all.obj);
              output.render('index',all.obj);
}, function(eror) {
                return output.json({ "error": "page problem" });

            });


        }, function(eror) {
            return output.json({ "error": "page problem" });

        });

 }, function(eror) {
            return output.json({ "error": "video problem" });

        });
    }, function(eror) {
        return output.json({ "error": "page problem" });

    });






}


);

app.get('/onepage', function(req, res) {



    res.sendFile('r32/OnePage2/index.html', { root: __dirname });

});



app.listen(port, function() {
    console.log('app runing in port ' + port);
});
