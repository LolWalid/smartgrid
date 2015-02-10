function clean(db) {
  //db.collection('players').remove({},function(err, result){})
  db.collection('players').update({},{$set: {isConnected: false}},{upsert: false, multi: true}, function(err, result) {
  })
}

function seed(db) {
  db.collection('cities').update({name: 'city'},
    {$set: { name: 'city'}
  },

  {upsert : true}, function(err, result) {
  });

  db.collection('resources').update({ name: "Money"},
  {
    name: "Money",
    shared: false,
    defaultValue: 1000,
    unit: "€"},
    {upsert : true}, function(err, result){})

  db.collection('resources').update({ name: "MoneyShared"},
  {
    name: "MoneyShared",
    shared: true,
    defaultValue: 10000,
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
module.exports.clean = clean;
