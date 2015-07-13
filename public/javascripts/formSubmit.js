$(function() {

  var convertSongToURL = function(songText) {



  }

  $( "#newUrl" ).submit(function( event ) {

    //convertSongToURL('Neil Young - Harvest Moon');

    // Stop form from submitting normally
    event.preventDefault();

    // Get some values from elements on the page:
    var $form = $( this ),
      term = $form.find( "textarea[name='urls']" ).val();
      console.log(term);
      url = $form.attr( "action" );

    // Send the data using post
    var posting = $.post( url, { urls: term } );

    var sock = setTimeout(initSockConnect, 50);

    var done = false;

      setInterval(function() {

        $("html, body").animate({ scrollTop: $(document).height() }, "slow");
        //$("html, body").animate({ background-color: "black" }, "slow");
        //$("html, body").animate({ color: "white" }, "slow");
      }, 500);

    // Put the results in a div
    posting.done(function( data ) {

      done = true;

      var response = $( data );
      $( "body" ).empty().append( response );

    });
  });


});
