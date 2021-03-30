const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vakyo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(express.json());
app.use(cors());

const port = 4000;

app.get('/', (req, res) =>{
  res.send('Working Done')
})

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client.db("emaJohnShop").collection("products");
  const ordersCollection = client.db("emaJohnShop").collection("orders");

  app.post("/addProduct", (req, res) => {
    const products = req.body;
    productsCollection.insertOne(products).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    });
  });

  app.get("/products", (req, res) => {
    productsCollection
      .find({})
      .toArray((err, docs) => {
        res.send(docs);
      });
  });

  //single data read
  app.get("/products/:key", (req, res) => {
    productsCollection
      .find({key : req.params.key})
      .toArray((err, docs) => {
        res.send(docs[0]);
      });
  });


  //multiple data load
  app.post('/productBykeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({key: { $in: productKeys}})
    .toArray((err, docs) => {
      res.send(docs);
    })
  })

  //order data
  app.post("/addOrder", (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
});

app.listen(process.env.PORT || port);
