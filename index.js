//5 steps
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const { response } = require('express');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bjnos.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

async function run() {

    try {

        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");

        //Insert Single Service
        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('Hit the post api',service);

            const result = await servicesCollection.insertOne(service);
            console.log("Insert Successful");
            res.json(result);
        })
        //Get All Service
        //GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })


        //Get Single Service
        // // create a document to insert
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })
        
        app.delete('/services/:id', async (req, res) => {
            console.log('server hitted');
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await servicesCollection.deleteOne(query);
            if (result.deletedCount === 1) {

                console.log("Successfully deleted one document.");

            } else {

                console.log("No documents matched the query. Deleted 0 documents.");

            }
            res.json(result);
        })
        

        //     title: "Record of a Shriveled Datum",

        //     content: "No bytes, no problem. Just insert a document, in MongoDB",

        // }

        // const result = await haiku.insertOne(doc);

        // console.log(`A document was inserted with the _id: ${result.insertedId}`);

    } finally {

        //await client.close();

    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Hello Sir");
})


app.listen(port, () => {
    console.log('Running Genius Server on port ', port);
});