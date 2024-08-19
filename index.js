const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// MiddleWare
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jtwnv2k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const artCollection = client.db("artDB").collection("art");

    app.get("/list", async (req, res) => {
      const cursor = artCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/list/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artCollection.findOne(query);
      res.send(result);
    });

    app.post("/list", async (req, res) => {
      const newList = req.body;
      console.log(newList);
      const result = await artCollection.insertOne(newList);
      res.send(result);
    });

    app.put("/list/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = req.body;
      const doc = {
        $set: {
          image_url : updateDoc.image_url,
          item_name : updateDoc.item_name,
          subCategory_name : updateDoc.subCategory_name,
          short_description : updateDoc.short_description,
          price : updateDoc.price,
          rating : updateDoc.rating,
          customization : updateDoc.customization,
          processing_time : updateDoc.processing_time,
          stockStatus : updateDoc.stockStatus,
          user_email : updateDoc.user_email,
          user_name : updateDoc.user_name,
        },
      };
      const result = await artCollection.updateOne(filter, doc, options)
      res.send(result);
    });

    app.delete("/list/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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
  res.send("Server Is Runninggggggg");
});

app.listen(port, (req, res) => {
  console.log(`Server Is running on Port ${port}`);
});
