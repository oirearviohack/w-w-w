//var MongoClient = require('mongodb').MongoClient;
var url = require('url');
var express = require('express');
var app = express();
//var mongoURI = 'mongodb://localhost/wellness';
//var str = "";
//var r = []

var https = require('https')


//curl -X GET localhost:3000/search?q='\{"uid":"9"\}'

/*
app.route('/search').get(function(req, res) {

    var url_parts = url.parse(req.url, true);
    var qqq = url_parts.query['q']
    console.log(qqq)
    if (qqq == null) {
	//res.json({'error': 'Missing query!'})
	qqq='{}'
    } else {

	MongoClient.connect(mongoURI, function(err, db) {

	    db.collection('unify_data').find(JSON.parse(qqq)).limit( 2 ).toArray(function(err, docs){
		console.log(err)
		console.log(docs)
		res.json(docs);
	    });
	});
    }
});
*/

app.route('/w2e').get(function(req, resres) {

    var url_parts = url.parse(req.url, true);
    var w2ePath = url_parts.query['path']
    console.log(w2ePath)

    https.get({
	     hostname: 'developer.w2e.fi',
	     port: 443,
	     path: w2ePath,
	     agent: false,  // create a new agent just for this one request
	     headers: {'Authorization': 'Bearer Uczu2IWSC2oHVwKWJb9lIQlLcpngUhsxZcMogW0vm3LfUZ14'}
      }, function (res) {
	       var output = '';
         console.log('status code = ' + res.statusCode);
         res.setEncoding('utf8');

         res.on('data', function (chunk) {
            output += chunk;
          });

        res.on('end', function() {
            var obj = JSON.parse(output);
	          resres.json(obj)
            //onResult(res.statusCode, obj);
        });
    });
});


var server = app.listen(3000, function() {});
