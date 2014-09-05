
# Sandee

Sandee is an app build with Node.js and Angular allowing to quickly create HTML, CSS & JS based sandboxes in a development environment.

## Installation

- Install [Node.js](http://nodejs.org/)
- Clone the repo `git clone https://github.com/konpa/sandee.git`
- Install node packages `npm install`
- Install bower components `bower install`
- Launch Sandee app `npm start`
- Open http://localhost:3000 in your browser

## Configuration

All configurations are stored in the sandee.json file:

##### editor
Store the path of your favorite editor. It will be used to open the corresponding sandbox folder in this text editor.

##### port
Store the port of sandee app

##### dev_port
Store the port of sandee app in dev mode. The proxy option of browser-sync will be set with this port.

##### sandboxes_port
Store the range port for sandboxes. Each sandbox will increment this port by one (e.g. If port 6000 is choseen, the first sandbox will be launch with the port 6001, the second 6002, etc...)
