var 
  express = require('express'),
  mongoose = require('mongoose'),
  compression = require('compression'),
  qs = require('querystring'),

  app = express(),
  appPort = 8082,

  playlistSchema,
  playlistModel,
  Playlist,

  addMedia,
  deleteMedia,
  getPlaylist,
  deletePlaylist;

app.use(compression());
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost/teleport-cms');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  playlistSchema = mongoose.Schema({
    'userId': {type: String},
    'playlistId': {type: String},
    'media': {type: mongoose.Schema.Types.Mixed}
  });
  Playlist = mongoose.model('Playlists', playlistSchema);
  app.listen(appPort);
  console.log('cms is listening on port: ' + appPort);
});

app.options('*', function (req,res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods:','GET,POST,DELETE,OPTIONS');
  res.send();
});

app.post('/user/:userId/playlist/:playlistId', function (req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  var body = '';
  req.on('data', function (data) {
    if (data) {
      body += data;
    }
    // Too much POST data, kill the connection!
    if (body.length > 1e6)
      req.connection.destroy();
  });
  req.on('end', function () {
    try {
      var media = JSON.parse(body);
    } catch(error) {
      return res.send(400, 'Could not parse the JSON for the media.  Please make sure JSON it is well formatted.');
    }
    
    addMedia(req.params.userId, req.params.playlistId, JSON.parse(body), function(error, successMessage){
      if (!error) {
        res.send(200, successMessage);
      } else {
        res.send(500, error);
      }
    });
  });
});

app.get('/user/:userId/playlist/:playlistId', function (req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  getPlaylist(req.params.userId, req.params.playlistId, function(error, playlistData){
    if (!error) {
      res.json(200, playlistData);
    } else if (error.indexOf('NOT FOUND' === 0)) {
      res.send(404, error);
    } else {
      res.send(500, error);
    }
  });
});

app.delete('/user/:userId/playlist/:playlistId/media/:mediaId', function (req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  deleteMedia(req.params.userId, req.params.playlistId, req.params.mediaId, function(error, successMessage) {
    if (!error) {
      res.send(200, successMessage);
    } else if (error.indexOf('NOT FOUND' === 0)) {
      res.send(404, error);
    } else {
      res.send(500, error);
    }
  });
});

app.delete('/user/:userId/playlist/:playlistId', function (req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  deletePlaylist(req.params.userId, req.params.playlistId, function(error, successMessage) {
    if (!error) {
      res.send(200, successMessage);
    } else if (error.indexOf('NOT FOUND' === 0)) {
      res.send(404, error);
    } else {
      res.send(500, error);
    }
  });
});

addMedia = function (userId, playlistId, media, callback) {
  if (!userId || !playlistId || !media || !media.src) {
    return callback('Missing required params.  You must provide a userId and playlistId in the url path and a JSON media object in the body.');
  }
  
  Playlist.update(
    {userId: userId, playlistId: playlistId, media: media},
    {userId: userId, playlistId: playlistId, media: media},
    {upsert: true},
    function (err) {
      if (err) {
        return callback('There was an error trying to add the Media with id: ' + mediaId + ' for user: ' + userId + ' to playlist: ' + playlistId);
      }
      callback(null, media.id + ' added to ' + playlistId + ' successfully.');
  });
};

deleteMedia = function(userId, playlistId, mediaId, callback) {
  if (!userId || !playlistId || !mediaId) {
    return callback('Missing required params.  You must provide a userId, playlistId, and mediaId in the url path.');
  }

  Playlist.findOneAndRemove(
    {userId: userId, playlistId: playlistId, "media.id": mediaId}, 
    function (err, deletedMedia) {
      if (err) {
        return callback('There was an error trying to delete the Media with id: ' + mediaId + ' for user: ' + userId + ' in playlist: ' + playlistId);
      }
      if (!deletedMedia) {
        return callback('NOT FOUND: No media found with id: ' + mediaId + ' for user: ' + userId + ' in playlist: ' + playlistId);
      }
      callback(null, 'Media with id ' + mediaId + ' deleted from ' + playlistId + ' successfully.');
  });
};

getPlaylist = function(userId, playlistId, callback) {
  if (!userId || !playlistId) {
    return callback('Missing required params.  You must provide a userId and playlistId in the url path.');
  }
  Playlist.find(
    {userId: userId, playlistId: playlistId}, 
    function (err, results) {
      if (err) {
        return callback('Could not get playlist with the id: ' + playlistId + 'for the user with id: ' + userId + '.');
      } 
      if (results && results[0]) {
        var videos = [];
        for (var i = 0; i < results.length; i++) {
          videos[i] = results[i].media;
        }
        return callback(null, videos);
      }
      callback('NOT FOUND: Could not find playlist with the id: ' + playlistId + ' for the user with id: ' + userId + '.');
  });
};

deletePlaylist = function(userId, playlistId, callback) {
  if (!userId || !playlistId) {
    return callback('Missing required params.  You must provide a userId and playlistId in the url path.');
  }
  Playlist.findOneAndRemove(
    {userId: userId, playlistId: playlistId}, 
    function (err, deletedPlaylist) {
      if (err) {
        return callback('Could not delete playlist with the id: ' + playlistId + 'for the user with id: ' + userId + '.');
      }
      if (!deletedPlaylist) {
        return callback('NOT FOUND: No playlist found with id: ' + playlistId + ' for user: ' + userId);
      }
      callback(null, 'Playlist with id ' + playlistId + ' deleted successfully.');
  });
};

exports.addMedia = addMedia;
exports.deleteMedia = deleteMedia;
exports.getPlaylist = getPlaylist;
exports.deletePlaylist = deletePlaylist;