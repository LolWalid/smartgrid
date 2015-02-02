SmartGrid
=======

Game using express with node.js and mongodb.

To launch the application :

Create a directory data that will contain our database
```
mkdir data
cd data
```

Launch the database server
```
mongod --dbpath .
```
Launch the server
```
npm start
```

Routes available:
```
For players:
  / : homepage, will contain all player's information
  /login : log a player
  /player/data : get player's data (id, money, energy, satisfaction, score)
  /logout : disconnect a player
  /objectives : contain indivual and common player's objectives
  /objects : Players can buy objects to complete objectives

For admin:
  /objectives/admin/ : admin can add new objectives and send them to the players.
  /events/admin : add and edit events then send them to players
  /decisions/admin : add and edit common decisions then send them to players
  /resources/admin : add and edit resources
  /objects/admin : add and edit objects
  /players/admin : Show connected players, can disconnect them and show their progression
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

  /objects/list : json with all objects
  /objects/add : add object
  /objects/edit : edit object
  /objects/delete/:id : delete object

  /decisions/list : json with all decisions
  /decisions/add : add decision
  /decisions/edit : edit decision
  /decisions/delete/:id : delete decision

  /resources/list : json with all resources
  /resources/add : add resource
  /resources/edit : edit resource
  /resources/delete/:id : delete resource

  /players/list : json with all players connected
  /players/add : add player to db when connected
  /players/show/:id : return all data of a player
  /players/delete/:id : delete and deconnect player with id id
  /players/deleteAll : delete and deconnect all players.


TODO:-
  CF TODO.txt
```
