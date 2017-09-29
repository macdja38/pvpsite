## PvPCraft website for pvpcraft discord bot.

Can be found at [bot.pvpcraft.ca](https://bot.pvpcraft.ca)

To build for release, run `npm run build --release`

## Requirements 
#### You must have:
1. Access to the same RethinkDB as pvpcraft
2. node.js and npm
3. git and node-gyp

## Installation
#### In your command line of choice, enter:
1. `git clone https://github.com/macdja38/pvpsite.git` to clone the repo
2. `cd pvpsite` to enter the project directory git just made
3. `npm install` to install dependencies
4. `vim src/config.js` and `vim src/client.config.js` to edit the config files
5. `npm run build --release` to build the project
6. `node /build/server.js` to run the project

Optionally, set up a caching reverse proxy to serve the static files (js and PvPCraft logo are the most important), and to forward from port 80 to 3000.
