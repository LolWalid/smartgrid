 function seed(db) {
  //Update db
  // db.collection('players').remove({}, function(err, result) {
  // });

  db.collection('players').update({},{$set: {isConnected: false}}, function(err, result) {
  });

  db.collection('resources').update({ name: "Money"},
  {
    name: "Money",
    shared: true,
    defaultValue: 1000,
    unit: "€"},
    {upsert : true}, function(err, result){})

  db.collection('resources').update({ name: "Energy"},
  {
    name: "Energy",
    shared: false,
    defaultValue: 100,
    unit: "kW" },
    {upsert : true}, function(err, result){})

  db.collection('resources').update({ name: "Score"},
  {
    name: "Score",
    shared: false,
    defaultValue: 0,
    unit: "" },
    {upsert : true}, function(err, result){})

  db.collection('resources').update({ name: "Satisfaction"},
  {
    name: "Satisfaction",
    shared: false,
    defaultValue: 50,
    unit: "" },
    {upsert : true}, function(err, result){})
}

module.exports.seed = seed;
