const express = require('express')
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000 

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.Mongo_USER}:${process.env.Mongo_PASS}@cluster0.hmmbger.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const database = client.db("Toy-center")
    const toyCollection = database.collection("Toys")

    app.post("/toys", async(req, res)=>{
 
        const toy = req.body;
        const result = await toyCollection.insertOne(toy);
        res.send(result)
    })
    app.get("/toys", async(req, res)=>{
        const query = toyCollection.find()
        const result = await query.toArray()
        res.send(result)
    })


    app.put("/toys/:id", async(req, res)=>{

      console.log(req.body);
      const id =req.params.id;
      const query = {_id : new ObjectId(id)}
      const options = { upsert: true };
      const updateData = req.body;
      const updateDoc = {
        $set:{
          imageUrl: updateData.imageUrl,
          toyName: updateData.toyName,
          name: updateData.name,
          email: updateData.email,
          category: updateData.category,
          price: updateData.price,
          rating: updateData.rating,
          quantity: updateData.quantity,
          description: updateData.description
        }
        
      }
      const result = await toyCollection.updateOne(query, updateDoc, options)
      res.send(result)
    })
   

    app.get("/toys/:id", async(req, res)=>{
      const id = req.params.id;
      const cursor = {_id : new ObjectId(id)}
      const result = await toyCollection.findOne(cursor).toArray()
      res.send(result)
    })
    app.delete("/toys/:id" , async(req, res)=>{
      const id = req.params.id;
      const cursor = {_id : new ObjectId(id)}
      const result = await toyCollection.deleteOne(cursor)
      res.send(result)
    })

    app.get("/toyes", async(req, res)=>{

     let query= {}
     if(req.query?.toyName){

      query = { toyName : req.query.toyName}
     }
     
     const result = await toyCollection.find(query).toArray()
     res.send(result)

    })
    app.get("/mytoyes", async(req, res)=>{

      let query ={}
      if(req.query?.email){
        query = {email : req.query.email}
      }

      const result = await toyCollection.find(query).toArray()
      res.send(result)
    })
   

    app.get("/mytoyesort", async(req, res)=>{

      let query ={}
      if(req.query?.email){
        query = {email : req.query.email}
      }

      const result = await toyCollection.find(query).sort({price:1}).toArray()
      res.send(result)
    })
   
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res)=>{
    res.send("Toy-center server is running")
})

app.listen(port, ()=>{
    console.log(`Toy-center server is running on ${port}`);
})