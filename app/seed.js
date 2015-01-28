 function seed(db) {
  //Update db
  db.collection('players').remove({}, function(msg) {
  });

  db.collection('resources').update({ name: "Money"},
  {
    name: "Money",
    shared: true,
    defaultValue: 1000,
    unit: "€"},
    {upsert : true}, function(msg){})

  db.collection('resources').update({ name: "Energy"},
  {
    name: "Energy",
    shared: false,
    defaultValue: 100,
    unit: "kW" },
    {upsert : true}, function(msg){})

  db.collection('resources').update({ name: "Score"},
  {
    name: "Score",
    shared: false,
    defaultValue: 0,
    unit: "" },
    {upsert : true}, function(msg){})

  db.collection('resources').update({ name: "Satisfaction"},
  {
    name: "Satisfaction",
    shared: false,
    defaultValue: 50,
    unit: "" },
    {upsert : true}, function(msg){})
}

module.exports.seed = seed;
