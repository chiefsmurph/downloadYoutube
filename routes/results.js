var express = require('express');
var router = express.Router();
var zipdir = require('zip-dir');

var fs = require('fs');
var ytdl = require('youtube-dl');
var spawn = require('child_process').spawn

var http = require('http');
var sockjs = require('sockjs');
var async = require('async');

var outputServer = require('../bin/setupSockServer')();

var waitBeforeDelete = 25; // seconds
/* GET users listing. */
router.post('/', function(req, res, next) {


  var logspawn = function(spawn) {

    // Let's echo the output of the child to see what's going on
    spawn.stdout.on('data', function(data) {
      console.log(data.toString());
    });

    // Incase something bad happens, we should write that out too.
    spawn.stderr.on('data', function(data) {
      console.error(data.toString());
    });
  }

  var removeAsset = function(asset) {



    var removeFolder = spawn('rm', ['-r', 'assets/' + asset]);
    var removeZip = spawn('rm', ['assets/' + asset + '.zip']);

    logspawn(removeFolder);
    logspawn(removeZip);

  }

  var getDateTime = function() {

      var date = new Date();

      var hour = date.getHours();
      hour = (hour < 10 ? "0" : "") + hour;

      var min  = date.getMinutes();
      min = (min < 10 ? "0" : "") + min;

      var sec  = date.getSeconds();
      sec = (sec < 10 ? "0" : "") + sec;

      var year = date.getFullYear();

      var month = date.getMonth() + 1;
      month = (month < 10 ? "0" : "") + month;

      var day  = date.getDate();
      day = (day < 10 ? "0" : "") + day;

      return year + "-" + month + "-" + day + "-" + hour + "-" + min + "-" + sec;

  }

  dir = getDateTime();

  if (!fs.existsSync('assets/' + dir)){
    fs.mkdirSync('assets/' + dir);
  }

  var getAudio = function(url, res) {

      youtube_dl = spawn('youtube-dl', [
        '--output',
        'assets/' + dir + '/%(title)s.%(ext)s',
        '--extract-audio',
        '--audio-format',
        'mp3',
        '--audio-quality=320k',
        url
      ]);

      // Let's echo the output of the child to see what's going on
      youtube_dl.stdout.on('data', function(data) {
        console.log(data.toString());
        outputServer.broadcast(data.toString());
      });

      // Incase something bad happens, we should write that out too.
      youtube_dl.stderr.on('data', function(data) {
        console.error(data.toString());
        outputServer.broadcast(data.toString());
      });

      youtube_dl.on('exit', function(data) {

        done++;

        if (done === eachofem.length) {

            zipdir('assets/' + dir, { saveTo: 'assets/' + dir + '.zip' }, function (err, buffer) {
              // `buffer` is the buffer of the zipped file
              // And the buffer was saved to `~/myzip.zip`

              setTimeout(function() {
                removeAsset(dir);
                console.log('cleaned up ' + dir);
              }, waitBeforeDelete * 1000);


              res.render('results', { title: eachofem[0] + ' and others...', dl_link: dir  });


            });

        }

      });

  }

  var eachofem = req.body.urls.split('\n');
  console.log(eachofem);
  var done = 0;

  for(var i=0; i<eachofem.length; i++) {
    getAudio(eachofem[i], res);
    //sock.send('one down');
  }





});

module.exports = router;
