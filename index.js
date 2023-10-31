const { Console } = require('console');
const http = require('http');
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb');
app.use(express.json())
const todoRoutes = express.Router()

const { default: mongoose } = require('mongoose');
const uri = 'mongodb+srv://giridharansivam:9zXvKvm75gqIkvQl@cluster0.x0srfqb.mongodb.net/MarketPlace?retryWrites=true&w=majority'
const client = new MongoClient(uri, { useNewUrlParser: true });
const database = client.db('MarketPlace');
app.use(cors());

app.use(bodyParser.json());
const Product = require('./model/product.model');
const Category = require('./model/category.model');
const { exec } = require('child_process');

mongoose.connect(uri,{useNewUrlParser:true});
const connection = mongoose.connection;

connection.once('open',()=>{
    const dbName = mongoose.connection.client.s.options.dbName;
  console.log('Connected to the database:', dbName);
})

app.get('/',(req,res)=>{
    res.send("Welcome to Dress Application")
})

async function retrieveProducts() {
    try {
      const products = await Product.find({}).exec();
      console.log('All products:', products);
    } catch (error) {
      console.error('Error retrieving data:', error);
    } finally {
      // Close the connection when you're done
      mongoose.connection.close();
    }
  }
  

app.get('/api/products',(req,res)=>{

    Product.find({})
        .then(products=>{
            
            res.send(products)
            console.log(products)
        })
})
app.get('/api/categories',(req,res)=>{
    Category.find()
    .then(category=>{
        res.send(category)
    })
})
app.get('/api/products/:id',(req,res)=>{

    Product.find({_id:req.params.id})
        .then(products=>{
            
            res.send(products)
        })
})

app.get('/api/products/:id',(req,res)=>{
    Product.find({_id:req.params.id}).then(products=>{
        res.send(products)
    })
})
app.post('/api/products',(req,res)=>{

    const product = {
        _id:req.body._id,
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        quantity:req.body.quantity,
    }

   const collection = database.collection('products')
   const result = collection.insertOne(product)
   res.send(collection.find())
})

app.put('/api/products/:id',async (req,res)=>{
    
    try {
        const productId = req.params.id;
        
        
        // Use findOneAndUpdate to find the product by ID and update it
        const updatedProduct = await Product.findOneAndUpdate({ _id: productId },
            { $set: req.body },
            { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        console.log(updatedProduct)
        res.json(updatedProduct);
    
    } 
    catch (error) 
    {

        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    
    }
    
})
app.delete('/api/products/:id',(req,res)=>{

    const removedProduct = Product.find({_id:req.params.id})
    Product.deleteOne({_id:req.params.id}).then(
        product =>{
            res.send(product)
        }
    )
})
app.delete('/api/products',(req,res)=>{
    Product.deleteMany({}).then(
        product =>{
            res.send(product)
        }
    )
})

app.use(todoRoutes);
app.listen(3000)