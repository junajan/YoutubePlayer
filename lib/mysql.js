var mysql = require('mysql');
//    get ( resReport, "*", "u_prava", "1=1", null, "id", "ASC" );
//    insert ( resReport,"u_prava", {const:"AAA"+ (new Date().getMilliseconds()), "popis": "popis" });
//    update ( resReport, "u_prava", {const:"BBBB"}, "id IN (?)", [45,47,48] );
//    sql ( resReport, "SELECT * FROM u_prava WHERE id IN (?)", [1,2,3] );

function MySQLClass ( config ) {
    
    pool = mysql.createPool( config );
    
    return { 
        mysql: pool,
        hello: function () {
            console.log ( "SAY HELLO to " + config.host );
        },
        resReport: function ( err, res ) {

           console.dir ( "ERROR: " + JSON.stringify(err) ); 
           console.dir ( "RESULT: "+ JSON.stringify(res) ); 
        },
        getData: function ( callback, what, where, cond, params, orderBy, orderDesc, limit ) {

                pool.getConnection(function(err, conn){

                    if ( err ) {

                        callback ( err );
                        conn.release()
                    }
                    else {

                        sql = "";
                        if ( what )
                            sql = "SELECT "+ what;

                        if ( where )
                            sql += " FROM "+ where;

                        if ( cond )
                            sql += " WHERE "+ cond;

                        if ( orderBy )
                            sql += " ORDER BY "+ orderBy;

                        if ( orderBy && orderDesc )
                            sql += " "+ orderDesc;

                        if ( limit )
                            sql += " LIMIT "+ limit;

                        if ( config.showSQL )
                            console.log ( "SELECT: "+sql + " | PARAMS: "+ JSON.stringify(params));

                        conn.query( sql, params, function(err, rows) {

                            callback ( err, rows, callback );
                            conn.release()
                        });
                    }
             });
        },
        get: function ( callback, what, where, cond, params, orderBy, orderDesc ) {

            this.getData (
                function ( err, rows ) {

                    if ( ! err )
                        rows = rows[0];

                    callback ( err, rows );
                },
                what, where, cond, params, orderBy, orderDesc, 1 )
        },
        insert: function ( callback, where, params ) {

                pool.getConnection(function(err, conn){

                    if ( err ) {

                        callback ( err );
                        conn.release()
                    }
                    else {

                        where = "INSERT INTO "+ where + " SET ? ";

                        if ( config.showSQL )
                            console.log ( "INSERT: "+ where +" | PARAMS: "+ JSON.stringify(params));

                        conn.query( where, params, function(err, res) {

                            callback ( err, res );
                            if ( conn )
                                conn.release();
                        });
                    }
             });
        },
        update: function ( callback, where, values, cond, params ) {

                pool.getConnection(function(err, conn){

                    if ( err ) {

                        callback ( err );
                        if ( conn )
                            conn.release();
                    }
                    else {

                        sql = "UPDATE "+ where + " SET ";
                        sqlVals = [];
                        arr = [];
                        
                        for ( j in values ) {
                            
                            if ( j[0] == "." )
                                sqlVals . push ( j.substr(1)+ " = "+ values[j] )
                            else {
                                sqlVals . push ( j+ " = ?" )
                                arr . push ( values[j] );
                            }
                        }
                        
                        sql += sqlVals.join(", ");
                        
                        if ( cond )
                            sql += " WHERE "+cond;
                        
                        if ( ! ( params instanceof Array ))
                            params = [params];

                        for ( i in params )
                            arr.push( params[i] );
//                        
//                        console.dir ( "=======================" );
//                        console.dir ( sql );
//                        console.dir ( arr );
//                        return false;
                        
                        if ( config.showSQL )
                            console.log ( "UPDATE: "+ sql +" | PARAMS: "+ JSON.stringify(arr));

                        conn.query( sql, arr, function(err, res) {

                            callback ( err, res );
                            if ( conn )
                                conn.release();
                        });
                    }
             });
        },
        sql: function ( callback, sql, params ) {

                pool.getConnection(function(err, conn){

                    if ( err ) {

                        callback ( err );
                        if ( conn )
                            conn.release();
                    }
                    else {

                        if ( config.showSQL )
                            console.log ( "SQL: "+sql + " | PARAMS: "+ JSON.stringify(params));

                        conn.query( sql, params, function(err, rows) {

                            callback ( err, rows, callback );
                            if ( conn )
                                conn.release()
                        });
                    }
             });
        }
    };
    
};

// Export this file as a module
module.exports = MySQLClass;
