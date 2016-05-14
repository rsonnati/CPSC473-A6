
  var express = require('express');
  var  router = express.Router();
  var   redis = require("redis");
  var  client = redis.createClient();

  var    wins = 0;
  var  losses = 0;

  var randomIntInc = function ( low, high ) {
    return Math.floor( Math.random() * (high - low + 1) + low );
  }

  router.delete( '/stats', function( req, res, next ) {
    var result = { wins : 0, losses : 0 };
    
    client.set( 'stats', JSON.stringify( result ), function( err, reply ) {
      if ( err ) {
        console.log( err );
        res.status(500).json( err );
      } else {
        if ( reply ) {
          console.log( reply );
        } else {
          console.log( "Nothing came back from Redis after reset");
        }
      }
      res.status(200).json( result );
    });
  });

  router.get('/stats', function( req, res, next ) {
    client.get('stats', function( err, reply ) {
      var result = { wins : 0, losses : 0 };
      if ( err ) {
        console.log( err );
      } else {
        if ( reply ) {
          console.log( reply );
          var o = JSON.parse(reply);
          result = o;
        } 
      }
      res.json( result );
    });
  });

  router.post('/flip', function( req, res, next ) {

    var    call = req.body.call;
    var   heads = 0;
    var   tails = 1;
    var    flip = randomIntInc( 0, 1 );
    var outcome = ( flip == 0 ? "heads" : "tails" );
    var contest = ( outcome == call ? "win" : "loss" );

    if ( contest == "win" ) wins++;
    if ( contest == "loss" ) losses++;
    var stats = { wins : wins, losses : losses };
    client.set( 'stats', JSON.stringify( stats ), function( err, reply ) {
      var  result = { result : contest };
      if ( err ) {
        console.log( err );
      } else {
        if ( reply ) {
          console.log( reply );
        } else {
          console.log( "Redis returned nothing when setting stats" );
        }
      }
      res.json( result );
    });
  });

  module.exports = router;
