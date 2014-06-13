$(document).ready( function () {
   var jcarousel = $('.jcarousel').jcarousel();


    var play = function ( o ) {

        id = $(o).attr("data-id");
        playId ( id );
    }

    function playId ( id ) {
        n = 40;

        $("#playlist li.active").removeClass("active");
        $("#playlist li.id_"+id).addClass("active");
        $(".player_wrapper").fadeOut();

        jwplayer('player').setup({
            'id': 'player',
            'autostart': true,
            'width': '580',
            'height': '360',
            'file': 'http://www.youtube.com/watch?v='+id,
            'controlbar': 'bottom'
          });

        title = $("#playlist li.active").find("img").attr("title");
        $(".player_content").find(".title").attr("title", title);
        
        title = title.substr(0,n-1)+(title.length>n?'&hellip;':'');
        $(".player_content").find(".title").html(title);
        $(".player_content").find(".link").attr("href", 'http://www.youtube.com/watch?v='+id );
        
        jwplayer("player").onComplete(function() {
          playNext();
        });

        $(".player_wrapper").fadeIn();
    }

    function playNext () {

        var id = $("#playlist li.active").next().attr("data-id");
        playId ( id );
    }

    function playPrev () {

        var id = $("#playlist li.active").prev().attr("data-id");
        playId ( id );
    }

    var triggers = function () {

        $(".remove").unbind("click");
        $(".remove").click(function( ev ){

            obj = $(this).parent().parent();
            obj.fadeOut(function (){ obj.remove();} );
            ev.stopPropagation();
        });

        $("#playlist .item").unbind("click");
        $("#playlist .item").click(function () {

            play ( $(this) );
        });
    }


    var showPlaylist = function ( list ) {
        if ( ! list )
            return false;
        $("#addMore").fadeIn();
            
        $("#f1").fadeOut();
        $(".playlist-wrapper").fadeIn();

        for ( i in list ) {

            item = "<li class='item hidden id_"+list[i].id+"' data-id='"+list[i].id+"'>\n\
                        <img src='//i1.ytimg.com/vi/"+list[i].id+"/mqdefault.jpg' title='"+list[i].name+"'>\n\\n\
                        <ul><li class='remove'></li></ul>\n\
                    </li>"

            $("#playlist").append ( item );
            $("#playlist .id_"+list[i].id).fadeIn();

        }
        
        $(".clearText").click();
        jcarousel.jcarousel('reload');
        initPlaylist ();
        triggers();
    }

    function initPlaylist () {


        $('.jcarousel-control-prev')
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '-=7'
            });

        $('.jcarousel-control-next')
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '+=7'
            });

        id = $("#playlist li").first().attr("data-id");
        playId ( id );
    }

    $(document).ready ( function () {

        setAjaxForm ( "f1",
        { 
            valid: showPlaylist
        });
        triggers();


        $(".clearText").click(function () {
           $("#f1 textarea").val(""); 
        });
        
        $("#addMore").click(function () {
            
           $("#addMore").fadeOut();
           $("#f1").fadeIn();
           $("#hide").fadeIn();
           $("#formText").fadeIn();
           $("#f1 textarea").focus();
            $('html, body').animate({
                scrollTop: $("#f1").offset().top
            }, 1000);
        });
        
        $("#hide").click(function () {
            
            $("#f1").fadeOut();
            $("#addMore").fadeIn();
            $(window).animate({ scrollTop: 0 }, 0);
        });
        
        $("#playNext").click(playNext);
        $("#playPrev").click(playPrev);
        
        setTimeout ( function () {
            $("#list").focus();
            str = $('#list').val();
            str = $.trim( str.replace(/\n*$/, '') );
            
            if ( str != "" ) {
                $("#list").val( str + "\n");
            }
        }, 300 );
    });
});