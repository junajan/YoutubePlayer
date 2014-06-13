
module.exports = function(app, global, chatrooms) {
    
    require('./static.js').add_routes(app, global, chatrooms);
    
    app.get('/exit', function(req, res){
        process.exit()
    });
    
    app.get('*', function(req, res){
        
        res.status(404);
        res.render("basic/error404");
    });

}