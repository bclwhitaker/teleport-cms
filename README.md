teleport-cms
============

A demo only "CMS".

Add Media to Playlist:
```bash
curl -X POST -H 'Content-Type: application/json' -d '{"src": ["http://video.m3u8","http://video.mp4","http://video.webm"],
"poster": "http://poster.jpg","id": "video1"}' http://localhost:8082/user/testuser0/playlist/testPlaylist0
```

Delete Media from Playlist:
```bash
curl -X DELETE http://localhost:8082/user/testuser0/playlist/testPlaylist0/media/video1
```

Get Playlist:
```bash
curl http://localhost:8082/user/testuser0/playlist/testPlaylist0
```

Delete Playlist:
```bash
curl -X DELETE http://localhost:8082/user/testuser0/playlist/testPlaylist0
```