const express = require('express');
const parser = require('body-parser');
const server = express();
//
server.use(parser.json());
server.use(express.static('client/build'));
server.use(parser.urlencoded({extended: true}));

const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID




MongoClient.connect("mongodb://localhost:27017", function(err, client){
  if(err){
    console.log(err);
    return;
  }
  const db = client.db("films_db");
  console.log("Connected to DB!");



server.post("/api/films", function(req, res){
  const filmCollection = db.collection("films");
  const filmToSave = req.body;
  filmCollection.save(filmToSave, function(err, result){
    if(err){
      console.log(err);
      res.status(500);
      res.send();
    }
    console.log("Saved to DB");
    res.status(201);
    res.json(result);
  })
})

server.get("/api/films", function(req,res){
  const filmsCollection = db.collection("films");
  filmsCollection.find().toArray(function(err, allFilms){
    if(err){
      console.log(err);
      res.status(500);
      res.send();
    }
    res.json(allFilms);
  })
})

server.delete("/api/films", function(req, res){
  const filmsCollection = db.collection("films");
  filmsCollection.deleteMany({}, function(err, deleteFilms){
    if(err){
      console.log(err);
      res.status(500);
      res.send();
    }
    res.json(deleteFilms);
  });
})

server.put("/api/films/:id", function(req, res){
  const filmsCollection = db.collection("films");
  const objectID = ObjectID(req.params.id);
  const filterObject = { _id:  objectID};
  const updatedData = req.body;
  filmsCollection.update(filterObject, updatedData, function(err,result){
    if(err){
      console.log(err);
      res.status(500);
      res.send();
    }
    res.status(204);
    res.send();
  })
})



server.listen(3000, function(){
  console.log("Listening on port 3000");
});

});
