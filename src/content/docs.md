---
title: Documentation
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
| perms set <allow\|deny\|remove> <node>\[ --channel <user>]\[--role <role>]\[--user <user>] | set\'s permission nodes | Discord Perm Administractor |
| perms list  |  displays a link to the website with the current permissions setup | Discord Perm Administrator  |
| perms hardreset  |  removes all user defined permissions  |  Server Owner  |
  
Though few these commands form the most powerfull permissions system known to discord. Look at another module and find a node, something like music.play
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
