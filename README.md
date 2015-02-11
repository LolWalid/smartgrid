#SmartGrid

Game using express with node.js and mongodb.

##Install node and mongodb
Install nodejs, download it here : http://nodejs.org/

Install mongodb, download it here : https://www.mongodb.org/

Using windows, be sure to add "C:\Program Files\MongoDB 2.6 Standard\bin" to your PATH variable

##Launch the application

**Create a directory named data which will contain our database**
```
mkdir data
```

**Launch the database server**
```
mongod --dbpath ./data
```

**Install modules and their dependancies**
```
npm install
```

**Launch the server**
```
npm start
```
