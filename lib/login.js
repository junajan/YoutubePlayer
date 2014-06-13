var STR = require('../lib/string');
var sha1 = require('crypto');
var nodemailer = require("nodemailer");
nodemailer.sendmail = true;


function login ( g ) {
    
     this.T_USERS  = "u_uzivatele";
     this.T_LOGIN  = "u_uzivatele_prihlaseni";
     P_SECRET  = "m923jdkjwd";
    
    this.init = function () {
    }
    
    
    
    init ();
    return this;
}

module.exports = login;