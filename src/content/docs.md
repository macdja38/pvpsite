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
group or user in whatever way you deem fit.

If you are familiar with linux commands this chart should be enough. Just remember more specific things inherit from less specific things.

| command  | description  | node  |
|---|---|---|
| perms set <allow\|deny\|remove> <node>\[ --channel <channel>]\[--role <role>]\[--user <user>] | set\'s permission nodes | Discord Perm Administrator |
| perms list  |  displays a link to the website with the current permissions setup | Discord Perm Administrator  |
| perms hardreset  |  removes all user defined permissions  |  Server Owner  |
  
Though few, these commands form the most powerfull permissions system known to discord. Look at another module and find a node, something like music.play
If you want to give away all commands beginning with music, you can add the wildcard *, eg: `music.*`. 
To allow a permission node for everyone in all text channels, for example enabling music for everyone in all text channels.

```
/perms set allow music.*
```

You can then constrain that a bit more by adding one of the optional adjustments onto the end of it. Let's see how it looks when we constrain the node to one channel.
```
/perms set allow music.* --channel #djs
```
In this case we allow the users to use all the music commands in the text chat `#djs` which limits the spam created by users running these commands.
Say you want to keep forceskip for your admin team though. To do this you would first deny the users the forceskip permission. Then allow it for your admin group.
This example builds on top of the previous channel specific permission. If you want server wide music commands remove the `--channel #djs` from the following commands.
```
/perms set deny music.forceskip --channel #djs
```
```
/perms set allow music.forceskip --channel #djs --group @Admin
```

## Giveaways

Giveaways allow you to host giveaways on your discord server. At the moment only one giveaway can be hosted on each discord.

PvPCraft's giveaway module allows you to chose who can enter the giveaway, as well as assign groups/users of your chosing the ability
to draw.

| command  | description  | node  |
|---|---|---|
| giveaway <enable\|disable>\[ --channel <channel>] | enables or disables the giveaways. If no channel is provided it will use the last one used, or if none has been used the channel the message was sent in. | admin.giveaway.setup |
| clear | clears all entries | admin.giveaway.clear  |
| count | counts all entries | admin.giveaway.count  |
| draw [count] | clears all entries | admin.giveaway.draw  |
| enter |  enters a giveaway  |  giveaway.enter  |

Temporary note, the current permissions are `giveaway.admin` instead of `admin.giveaway` for the first 4 nodes. Those should be updated to the values in the table soon.

## Feeds Manager

This is similar to the permissions system but for events like warframe alerts and/or moderation log events.

| command  | description  | node  |
|---|---|---|
| feeds <start\|stop> <feed node>\[ --channel <channel>] | enables or disables a specific feed within a channel. | feed.manage |
| feeds check <node> | checks where a certain node goes | feed.check  |

### Available feeds
| feed node | description | permission node |
| --- | --- | --- |
| moderation.message.deleted | Logs message deletes | msglog.whitelist.messagedeleted | 
| moderation.message.updated | Logs message edits | msglog.whitelist.messageupdate |
| moderation.channel.created | Logs channel creation | |
| moderation.channel.deleted | Logs channel deletion | |
| moderation.channel.updated | Logs channel edits | |
| moderation.server.updated | Logs server updates | |
| moderation.role.created | Logs role creation | |
| moderation.role.updated | Logs edits to roles | |
| moderation.role.deleted | Logs role deletion | | 
| moderation.member.added | Logs joins | |
| moderation.member.removed | Logs leaves/kicks | |
| moderation.member.banned | Logs user bans | | 
| moderation.member.unbanned | Logs use unbans | |
| moderation.member.updated | Logs server specific user changes | |
| moderation.voice.join | Logs voice joins | |
| moderation.voice.leaves | Logs voice leaves | |
| moderation.user | Logs user changes | |
