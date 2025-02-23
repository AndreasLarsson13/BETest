const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');
const multer = require('multer');

const upload = multer();

const cors = require('cors'); // Import the cors package


const router = express

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());



// MongoDB connection URI
const uri = 'mongodb+srv://larssonandreas11:Hammarby1@cluster0.yha3nfs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Database Name
const dbName = 'Natbutiken'; // Update with your database name


app.get('/produkt/:param', async (req, res) => {
  const produktNamn = req.params.param;
  

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    // Connect to the MongoDB server

    const collectionName = 'Produkter'; // Update with your collection name
    // Fetch data from the collection
    const collection = db.collection(collectionName);

    const data = await collection.findOne({ _id: new ObjectId(produktNamn) });

    // Close the connection
    client.close();

    //currency
  const filterData = data
    if(req.query.currency === "se")
    {
      filterData.price *= dailyPriceSek
      filterData.sale_price *= dailyPriceSek
      filterData.variations.forEach(attributes => {
      if(attributes.price) {
        attributes.price *= dailyPriceSek
      }
    });
    }

    // Send the data as a response
    res.json(filterData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/products', async (req, res) => {

  try {
  
 const client = await MongoClient.connect(uri);
    const db = client.db(dbName);

    const collectionName = 'Produkter'; // Update with your collection name
    // Hämta data från samlingen baserat på söksträngen (om det behövs)
    const collection = db.collection(collectionName);
    
    const data = await collection.find({}).toArray();

    
    // Stäng anslutningen
    client.close();



    const dataSend = hanterPricSprak(data, req)

    // Send the data as a response
    res.json(dataSend);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/nyhetsbrev', async (req, res) => {
  const subscription_email = req.body.subscription_email;

  try {
      // Connect to the MongoDB server
      const client = await MongoClient.connect(uri);
      const db = client.db(dbName);

      // Get the newsletter collection
      const collection = db.collection('newsletter');

      // Insert the email into the newsletter collection
      await collection.insertOne({ email: subscription_email });

      // Close the connection
      client.close();

      // Send a success response
      res.status(200).send('Email subscription successful!');
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
  }
});



app.post('/produktAdd', async (req, res) => {
    console.log(req.body);

    try {
        // Connect to the MongoDB server
        const client = await MongoClient.connect(uri);
        const db = client.db(dbName);
  
        // Get the newsletter collection
        const collection = db.collection('newProduct');
        

        // Insert the email into the newsletter collection
        await collection.insertOne(req.body)
  
        // Close the connection
        client.close();
  
        // Send a success response
        res.status(200).send('Email subscription successful!');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
