module.exports = {

    clearInData: function ( d, fields, useNull ) {

        if ( typeof fields === 'object' && ! ( fields instanceof Array) )
            fields = Object.keys( fields );

        for ( i in d ) {
            
            if ( useNull == undefined && d[i] == null )
                delete d[i];
                
            else if(fields.indexOf(i) == -1)
                delete d[i];
        }
        return d;
    },

    mergeConfig: function (c1, c2) {

        for ( i in c1 )
            c2[i] = c1[i];

        return c2;
    }


}