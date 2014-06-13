var request = require('request');
var trim = require("../lib/trim.js");  
var async = require("async");  
var cheerio = require('cheerio');
        
var YOUTUBE_SEARCH = "http://www.youtube.com/results?sm=12&filters=video&lclk=video&search_query=";

function parseList ( list ) {
    
    newList = [];
    list = list.split("\n");
    for ( i in list ) {
        
        item = list[i].trim ();
        if ( item != "" )
            newList.push ( item );
    }
    return newList;
}

function processList ( list, cb ) {
    
    i = 1;
    j = 1;
    async.map ( list, function ( item, doneAsync ) {
        console.log ( i++ + " Processing: " + item );
        
        request(YOUTUBE_SEARCH + item, function (err, resp, body) {
            if (!err && resp.statusCode == 200) {
                $ = cheerio.load(body);
                type = $('#search-results').children().first().attr('data-context-item-type');
                if ( type == "video" ) 
                    id = $('#search-results').children().first().attr('data-context-item-id');
                else
                    id = null;
                
                console.log ( j++ + " Done: " + item + " ("+id+")");
                return doneAsync( null, {id: id, name: item} );
            }
            return doneAsync( err, item );
        });
    },
    function ( err, data ) {
        
        cb ( data );
    });
}

exports.add_routes = function (app, g) {
  
    app.get("/", function(req, res){
        
        res.render("basic/index");
    });
    
    app.post("/", function(req, res){
        
        list = parseList ( req.param('list', "") );
        if ( ! list.length ) 
            return res.send ( { error : { send : "No data given.. ?"}});
        
        processList ( list, function ( data ) {
	
            return res.send ( { valid : data });
        });
    });
};
