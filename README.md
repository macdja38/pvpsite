## PvPCraft website for PvPCraft Discord bot

Can be found at [bot.pvpcraft.ca](https://bot.pvpcraft.ca)

To build for release, run `npm run build --release`

## Requirements 
#### You must have:
1. Access to the same RethinkDB as pvpcraft
2. node.js 8.6 or higher and npm
3. git and node-gyp

## Installation
#### In your command line of choice, enter:
1. `git clone https://github.com/macdja38/pvpsite.git` to clone the repo
2. `cd pvpsite` to enter the project directory git just made
3. `npm install` to install dependencies
4. `cp src/config.example.js src/config.js` and `cp src/client.config.example.js src/client.config.js`
5. `vim src/config.js` and `vim src/client.config.js` to edit the config files, alternatively if you are not familiar with a command line editor like vim you may edit the files in anything but notepad. I like [windows](https://notepad-plus-plus.org/) or [macOS](https://www.barebones.com/products/bbedit/download.html)
6. `npm run build --release` to build the project
7. `node build/server.js` to run the project

Optionally, set up a caching reverse proxy to serve the static files (js and PvPCraft logo are the most important), and to forward from port 80 to 3000.
