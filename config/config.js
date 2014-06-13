var config = {
    local: {
        mode: 'local',
        port: 2020,
        databaseMySQL: {
            poolSize: 4,
            host     : 'localhost',
            user     : 'root',
            password : 'toor',
            database : '',
            showSQL    : false
        },
    },
    staging: {
        mode: 'staging',
        port: 4000,
        databaseMySQL: {
            host     : 'localhost',
            user     : 'root',
            password : 'root',
            database : 'guess'
        }
    },
    production: {
        mode: 'production',
        port: 8080,
        databaseMySQL: {
            host     : 'localhost',
            user     : 'root',
            password : 'root',
            database : 'guess'
        }
    }
}


function getLayout ( req, defLayout ) {
    
    if ( req.xhr )
        return ! req.xhr;
    
    if ( defLayout == null )
        config.defLayout = "frame/frame";
    
    return config.defLayout; 
    
}


module.exports = function(express, app, mode) {
    
    app.use( require('express-ejs-layouts'));
    app.use( express.static('./public'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.logger('dev'));
//    app.use(express.cookieSession({ secret: "wkd798hi23uwzd7826IH", cookie: { maxAge: 60 * 60 * 24 * 365 * 50 } }));

    
    var FileStore = require('connect-session-file');
    app.use(express.session({
        secret: 'wdwd',
        store: new FileStore({path:'./data/session', useAsync:true})
    }));
    
    app.use(function (req, res, next) {
        app.set("layout",  getLayout( req ));
        next();
    });
    
    app.engine('html', require('ejs-locals'));

    app.set('views', './view');
    app.set('view engine', 'html');
    app.set("layout",  "frame/frame");
    
    return config[mode || process.argv[2] || 'local'] || config.local;
}