const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p9rwg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
app.use(cors());
app.use(bodyParser.json());
const port = 5000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("volunteerNetwork").collection("events");
  const userEventCollection = client.db("volunteerNetwork").collection("users-event");

  app.post("/addEvent", (req,res) => {
    eventCollection.insertOne(req.body)
  })
  
  app.get("/events", (req,res) => {
    eventCollection.find({})
    .toArray((err,doc) => {
        res.send(doc);
    })
})

app.get("/events/:id", (req,res) => {
  const key = req.params.id;
  eventCollection.find({_id: ObjectId(key)})
  .toArray((err,doc) => {
      res.send(doc[0]);
  })
})

app.post("/yourEvents", (req,res) => {
  const info = req.body;
  userEventCollection.insertOne(info);
})

app.get("/registration", (req,res) => {
  userEventCollection.find({})
  .toArray((err,doc) => {
      res.send(doc);
  })
})

app.get("/yourEvents", (req,res) => {
  userEventCollection.find({email: req.query.email})
  .toArray((err,doc) => {
      res.send(doc);
  })
})

app.delete("/delete/:id", (req,res) => {
  userEventCollection.deleteOne({_id: ObjectId(req.params.id)})
  .then(result => {
    res.send(result.deletedCount > 0);
  })
})

});

app.get('/', (req, res) => {
  res.send('Hello!')
})

app.listen(port);