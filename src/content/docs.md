---
title: Documentation
description: Instructions for usage of PvPCraft Discord bot.
component: ContentPage
---
Hello and Welcome to PvPCraft's documentation. Some features that are still being tested may not be documented.

Prefixes default to /, // and !! but can be changed in your servers settings page.

This documentation is primarily about text commands.

## Permissions

Permissions are the cornerstone of every system of **PvPCraft** they allow you to limit commands to a specific channel,
role or user in whatever way you deem fit.

If you are familiar with linux commands this chart should be enough. Just remember more specific things inherit from less specific things.

| command  | description  | node  |
|---|---|---|
| perms set <allow\|deny\|remove> <node>\[ --channel <channel>]\[ --role <role>]\[ --user <user>] | sets permission nodes | Discord Perm Administrator |
| perms list  |  displays a link to the website with the current permissions setup | Discord Perm Administrator  |
| perms hardreset  |  removes all user defined permissions  |  Server Owner  |
  
Though few, these commands form the most powerful permissions system known to Discord. Look at another module and find a node, something like music.play
If you want to give away all commands beginning with music, you can add the wildcard *, eg: `music.*`. 
To allow a permission node for everyone in all text channels, for example enabling music for everyone in all text channels:

```
/perms set allow music.*
```

You can then constrain that a bit more by adding one of the optional adjustments onto the end of it. Let's see how it looks when we constrain the node to one channel.
```
/perms set allow music.* --channel #djs
```
In this case we allow the users to use all the music commands in the text chat `#djs` which limits the spam created by users running these commands.
Say you want to keep forceskip for your admin team though. To do this you would first deny the users the forceskip permission. Then allow it for your admin role(s).
This example builds on top of the previous channel specific permission. If you want server-wide music commands remove the `--channel #djs` from the following commands.
```
/perms set deny music.forceskip --channel #djs
```
```
/perms set allow music.forceskip --channel #djs --role @Admin
```

## Music

Music module allows you to setup the bot to play a queue of songs in a voice channel.

| command  | description  | node  |
|---|---|---|
| init | temporarily binds the bot to the voice channel the user is in, and the text channel the command was used in | music​.init |
| destroy | un-binds the bot from it's current voice and text channel and clears the queue​. | music​.destroy  |
| play <search term \| video link \| playlist > | plays the song or playlist in the bound channel | music​.play  |
| skip [target] | votes to skips the song at index in queue or the currently playing song | music​.list  |
| skip -f [target] | force skips the song at index in queue or the currently playing song
| pause | pauses the current song | music​.pause |
| resume | resumes the current song | music​.resume |
| list | lists the contents of the queue | music​.list |
| link | displays a link to the currently playing song | music.link | 
| time | displays the current time into the song | music​.time |
| volume [volume] | if volume is provided it sets the volume, if not it displays the volume | music​.volume​.set or/and music​.volume​.list
| shuffle | shuffles the current queue | music​.shuffle |

## Giveaways

Giveaways allow you to host giveaways on your Discord server. At the moment, only one giveaway can be hosted on each Discord server.

PvPCraft's giveaway module allows you to choose who can enter the giveaway, as well as assign roles/users of your choosing the ability
to draw.

| command  | description  | node  |
|---|---|---|
| giveaway <enable\|disable>\[ --channel <channel>] | enables or disables the giveaways. If no channel is provided it will use the last one used, or if none has been used the channel the message was sent in​. | admin​.giveaway​.setup |
| clear | clears all entries | admin​.giveaway​.clear  |
| count | counts all entries | admin​.giveaway​.count  |
| draw [count] | clears all entries | admin​.giveaway​.draw  |
| enter |  enters a giveaway  |  giveaway​.enter  |

## Moderation

Moderation module, mod log was moved into feeds, this is now just purge.
| command  | description  | node  |
|---|---|---|
| purge \[count]\[ --user <user>]\[ --before <message id>]\[ --after <message id>] | purges the text channel of messages | moderation.tools.purge |


## Feeds Manager

This is similar to the permissions system but for events like Warframe alerts and/or moderation log events.

| command  | description  | node  |
|---|---|---|
| feeds <start\|stop> <feed node>\[ --channel <channel>] | enables or disables a specific feed within a channel. | feed.manage |
| find <node> | checks where a certain node goes | feed.find  |

### Available feeds
| feed node | description | permission node |
| --- | --- | --- |
| moderation​.message​.deleted | Logs message deletes | msglog​.whitelist​.messagedeleted | 
| moderation​.message​.updated | Logs message edits | msglog​.whitelist​.messageupdate |
| moderation​.channel​.created | Logs channel creation | |
| moderation​.channel​.deleted | Logs channel deletion | |
| moderation​.channel​.updated | Logs channel edits | |
| moderation​.server​.updated | Logs server updates | |
| moderation​.role​.created | Logs role creation | |
| moderation​.role​.updated | Logs edits to roles | |
| moderation​.role​.deleted | Logs role deletion | | 
| moderation​.member​.added | Logs joins | |
| moderation​.member​.removed | Logs leaves/kicks | |
| moderation​.member​.banned | Logs user bans | | 
| moderation​.member​.unbanned | Logs use unbans | |
| moderation​.member​.updated | Logs server specific user changes | |
| moderation​.voice​.join | Logs voice joins | |
| moderation​.voice​.leaves | Logs voice leaves | |
| moderation​.user | Logs user changes | |

## Warframe

| command  | description  | node  |
|---|---|---|
| deal | gets Darvo’s daily deals | warframe​.deal |
| trader | gets the current voidtrader info | warframe​.trader |
| trial | gets links to the current trial statistics | warframe​.trial |
| wiki <item name> | searches the wiki for an item | warframe​.wiki |
| sortie | gets the current sortie | warframe​.sortie |
| farm | gets a random farming guide | warframe​.farm |
| damage | gets Telkhines damage table | warframe​.damage |
| primeaccess | gets the prime access info | warframe​.access |
| update | gets the current update and/or hotfix | warframe​.update |
| armor | does some armor calculations | warframe​.armor |
| alert[s] | gets the current alerts | warframe​.alert |
| alert[s] enable --channel <channel> | Enable alert tracking | admin​.warframe​.alerts |
| alert[s] add <item> | Adds an item to the items that are being tracked | admin​.warframe​.alerts |
| alert[s] remove <item> | Removes an item from the items that are being tracked | admin​.warframe​.alerts |
| alert[s] join <item> | Allows a user to get notifications when an item comes up | warframe​.alerts​.join |
| alert[s] leave <item> | Stops notifying a user about when an item comes up | warframe​.alerts​.leave |
| alert[s] list | Lists all the items users join or/and leave | warframe​.alerts​.list |
| alert[s] enable --channel <channel> | Enable alert tracking | warframe​.alert |

#### Misc

If a user has the permission node warframe.misc.soon the user will reply to `soon` with `soon:tm:`

## Ranks

#### Requirements
The **PvPCraft** bot must have a role that is higher than the rank you want it to add to users and it must have the 
Discord permission **Manage Roles**.

#### Notes:

If a rank is added with the **visible name** of joinrole it will not be visible on the `/rank list` output and it will
be added to users as they join the Discord server.

The **visible name** of a rank is the label for the rank that is visible to the users running /list or /rank join.

| command | description  | node  |
|---|---|---|
| rank add <visible name> --role <mention or exact name of an existing role> | adds the role from --role to the list of joinable ranks under the name of <**visible name**> | admin​.rank​.add |
| rank remove <visible name> | removes a rank from the list of join-able ranks |	admin​.rank​.remove |
| rank join <visible name> | adds the user of the command to the rank they request |	rank​.join​.use && rank​.join​.<visible name> |
| rank leave <visible name> |	removes the user of the command from the rank they request | rank​.leave​.user && rank​.leave​.<visible name> |
| rank list |	Lists all of the ranks | rank​.list |

#### Examples

If you want to simply allow all users to join all the ranks you've added to the rank list you can run

```
/perms set allow rank.*
```

If you want to add a rank to the list make sure you have admin.rank.add then run

```
/rank add member --role @member
```
where the first member is the label for the rank you want users to see, and the @member is a mention for or the exact 
name of the role you want added to the user when they run `/rank join member`


## Pokemon

| command | description  | node  |
|---|---|---|
| pokemon <pokemon> |	searches for a Pokemon |	pokemon.pokemon |
| shiny <pokemon> | searches for a shiny |	pokemon.shiny |
| pokestat <pokemon> |	gets a Pokemon’s stats |	pokemon.pokestat |
| hiddenability <pokemon> |	fetches a Pokemon’s hidden ability |	pokemon.hiddenability |

## Minecraft

| command | description  | node  |
|---|---|---|
| mcping <server address> | Pings a Minecraft server and displays some info about it. | minecraft.mcping |
| mcavatar <minecraft username> | Displays a user's Minecraft avatar | minecraft.avatar  |
| mcskin | Displays a user's Minecraft skin | minecraft.mcskin | 

## Utilities

Displays some misc info about servers and users and stuff.

| command | description  | node  |
|---|---|---|
| server | Displays some info about the server | utils​.serverinfo |
| user <user mention> | Displays some info about the user | utils​.userinfo  |
| ping | Displays the bot's ping | utils​.ping |
| lmgtfy <thing to google for them> | returns a let me google that for you link​. | utils​.lmgtfy |
| status | displays the bot's current status | utils​.status |
| getshardedinfo | displays the global information about the bot's connections | utils​.getshardedinfo |

## Cleverbot

If the user has the permission node `cleverbot.misc` respond to any messages in which they mention the bot with a 
message from Cleverbot.

## Welcome

Welcomes users to the server

| command | description  | node  |
|---|---|---|
| setwelcome <welcome message \| false>\[ -p]\[ --channel <channel>] | Sets the welcome message | admin.welcome.set |
flag -p means the bot will private message the user.

Variables
| variable | result |
| --- | --- |
| $mention | is replaced by a mention for the user eg @macdja38 |
| $server | replaced by the servers name |
| $user | replaced by the username of the user |

## Help

Help module... displays a link to this website

| node | description |
| --- | --- |
| help | display link to help website |
