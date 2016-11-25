## PvPCraft website for pvpcraft discord bot.

Can be found at https://bot.pvpcraft.ca

To build for release run `npm run build --release`

## Requirements 
1. access to the same rethinkdb as pvpcraft
2. have node.js and npm install.
3. have git and node-gyp installed

## Installation
1. clone the repo `git clone https://github.com/macdja38/pvpsite.git`
2. open the new directory: `cd pvpsite`.
3. install the dependancies: `npm install`
4. edit the config.js and client.config.js in the /src directory
5. build the project: `npm run build --release`
6. run the project: `node /build/server.js`
7. Optionaly setup a caching reverse proxy to server the static files (js and pvpcraft logo are most important) and to forward from port 80 to 3000.
