var 
  assert = require('assert'),
  sinon = require('sinon'),
  cms = require('../src/server'),

  testVideos = [];

describe('Playlists', function() {

  beforeEach(function() {
    video1 = {
      src: [
          'http://video.m3u8',
          'http://video.mp4',
          'http://video.webm',
      ],
      poster: 'http://poster.jpg',
      id: 'video1'
    }
    video2 = video1;
    video3 = video1;
    video2.id = 'video2';
    video3.id = 'video3';

    //TODO: Mock out mongo
  });

  afterEach(function() {
  });

  describe.skip('#addMedia()', function() {
    it('should add media to a playlist', function() {

    });

    it('should return a 500 on error', function() {

    });
  });

  describe.skip('#deleteMedia()', function() {
    it('should add media to a playlist', function() {

    });

    it('should return a 500 on error', function() {

    });
  });

  describe.skip('#getPlaylist()', function() {
    it('should add media to a playlist', function() {

    });

    it('should return a 500 on error', function() {

    });
  });

  describe.skip('#deletePlaylist()', function(){
    it('should add media to a playlist', function() {

    });

    it('should return a 500 on error', function() {

    });
  });
});
