Simon
=========

Simon game for my Social Mulitplayer Games class at NYU.

## Developing

1. Clone the repo
2. Run `npm i`
3. Run `npm i -g live-server`
4. Run `live-server` in the root directory

Live-server will auto-reload the page any time `game.css` or any of the TS files change.



## To see the chat
- `npm i`
- `typings install`
- Run `http-server -p 8081` in this (simon) directory
- Run `http-server -p 8080` in the communityFire directory
- Go to http://localhost:8080/#/ in your browser
- You need to be signed in with google to chat
- Firebase database of messages is at https://console.firebase.google.com/project/mpgameschat/database/data
