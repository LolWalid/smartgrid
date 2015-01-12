SmartGrid
=======

Game using node.js and express.

Routes available:
```
For player:
  / : homepage, will contain all player's information
  /player/data : get player's data (id, money, energy, satisfaction, score)
  /logout : disconnect a player
  /objectives : contain indivual and common player's objectives

For admin:
  /objectives/admin/ : admin can add new objectives and send them to the players.
  /events/admin : add and edit events then send them to players
  /map : show the map of the world

TODO :
  /ojects : buy new item
  /events : add and edit objects, players will buy them
```
