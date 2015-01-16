SmartGrid
=======

Game using express with node.js and mongodb.

Routes available:
```
For players:
  / : homepage, will contain all player's information
  /login : log a player
  /player/data : get player's data (id, money, energy, satisfaction, score)
  /logout : disconnect a player
  /objectives : contain indivual and common player's objectives

For admin:
  /objectives/admin/ : admin can add new objectives and send them to the players.
  /events/admin : add and edit events then send them to players
  /map : show the map of the world

Other Routes:
  /objectives/list : json with all objectives
  /objectives/add : add objectif
  /objectives/edit : edit objectif
  /objectives/delete/:id : delete objectif

  /events/list : json with all events
  /events/add : add event
  /events/edit : edit event
  /events/delete/:id : delete event

  /players/list : json with all players connected
  /players/add : add player to db when connected
  /players/:id : return all data of a player
  /players/delete/:id : delete and deconnect player with id id
  /players/deleteAll : delete and deconnect all players.


TODO:-
  /objects
```
