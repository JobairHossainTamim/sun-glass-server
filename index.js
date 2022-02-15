const express = require('express')
const app = express()
const cors=require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT ||  5000;
// Fectch All Mongo db Id
const objectId=require('mongodb').ObjectId;

// Middle wire
app.use(cors());
app.use(express.json());
// database check
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ylwaj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();  

        // Data Base Specification
        const database=client.db('glass_portal');
        const userCollection=database.collection("users_admin");
        const bannerCollection = database.collection("banner");
        const reviewCollection=database.collection("review");
        const productCollection=database.collection("product");
        const brandCollection=database.collection("brand");
        const purchaseCollection =database.collection("purchase");


        // Single User  insert Database  // User
        app.post('/users' , async (req , res)=>{
            const user=req.body;
            const result=await userCollection.insertOne(user);
            res.json(result);
            
          });

        //   Make Admin in Database
          app.put('/users/admin',async (req , res)=>{

            const user=req.body;
            const filter={email:user.email};
            const updateDoc={$set: {role:'admin'}};
            const result= await userCollection.updateOne(filter ,updateDoc);
            res.json(result);
          });
        //   for check email
        app.get('/users/:email', async (req , res)=>{
            const email= req.params.email;
            const query={ email: email};
            const user=await userCollection.findOne(query);
            let isAdmin =false;
            if(user?.role === 'admin'){
                isAdmin =true;
            }
            res.json({ admin : isAdmin})
        });
        // Banner Load 
         // Get all banner
         app.get('/banner',async (req, res)=>{
            const cursor= bannerCollection.find({});
            const service=await cursor.toArray();
            res.send(service);
        });

        // Save To user Review 
        app.post('/review' , async(req ,res )=>{
          const reviews=req.body;
          const result=await reviewCollection.insertOne(reviews)
          res.json(result)
        });
        // Fetch all Review
        app.get('/review',async (req, res)=>{
          const cursor= reviewCollection.find({});
          const review=await cursor.toArray();
          res.send(review);
      });
      // Add Product 
      app.post('/product' , async(req ,res )=>{
        const product=req.body;
        const result=await productCollection.insertOne(product)
        res.json(result)
      });
      // All Product Fetch Database
      app.get('/product',async (req, res)=>{
        const cursor= productCollection.find({});
        const product=await cursor.toArray();
        res.send(product);
    });
    // Delete All Product 
    app.delete('/product/:id', async(req,res)=>{
      const id=req.params.id;
      const query={_id:objectId(id) };
     const result=await productCollection.deleteOne(query);
     res.json(result);
  }); 

  // Fetch All Brand
  app.get('/brand',async (req, res)=>{
    const cursor= brandCollection.find({});
    const review=await cursor.toArray();
    res.send(review);
});
// Save purchase
app.post('/purchase' , async(req ,res )=>{
  const purchase=req.body;
  const result=await purchaseCollection.insertOne(purchase)
  res.json(result)
});

  // Fetch All Purchase
  app.get('/purchase',async (req, res)=>{
    const cursor= purchaseCollection.find({});
    const purchase=await cursor.toArray();
    res.send(purchase);

    // Fetch Email Using Purchase 
    app.get('/purchase/:email',async (req, res)=>{
      const email=req.params.email;
      const query={email :email};
      const purchase=await purchaseCollection.find(query).toArray();
      res.json(purchase);
  });
      // Delete Purchase
      app.delete('/purchase/:id', async(req,res)=>{
        const id=req.params.id;
        const query={_id:objectId(id) };
       const result=await purchaseCollection.deleteOne(query);
       res.json(result);
    }); 


});
        

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello Db server!')
  })
  
  app.listen(port, () => {
    
  })