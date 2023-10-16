const express = require("express");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.port || 5000;

//MiddleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sz2xe62.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const coffeeCollection = client.db("insertDB").collection("coffees");

app.get("/coffees", async (req, res) => {
  const cursor = coffeeCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});

app.get("/coffees/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const coffee = await coffeeCollection.findOne(query);
  res.send(coffee);
});

app.post("/coffees", async (req, res) => {
  const coffee = req.body;
  console.log(coffee);
  const result = await coffeeCollection.insertOne(coffee);
  res.send(result);
});

app.put("/coffee/update/:id", async (req, res) => {
  const id = req.params.id;
  const coffee = req.body;
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updateCoffee = {
    $set: {
      name: coffee.name,
      chef: coffee.chef,
      supplier: coffee.supplier,
      taste: coffee.taste,
      category: coffee.category,
      details: coffee.details,
      photo: coffee.photo,
    },
  };
  console.log(updateCoffee);
  const result = await coffeeCollection.updateOne(
    filter,
    updateCoffee,
    options
  );
  res.send(result);
});

app.delete("/coffee/delete/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await coffeeCollection.deleteOne(query);
  res.send(result);
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server running in the port: ${port}`);
});
