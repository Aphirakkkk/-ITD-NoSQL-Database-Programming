const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('อภิรักษ์ สายนุ้ย')
})

app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`)
})

const {MongoClient, ObjectId} = require('mongodb');
const uri = 'mongodb://localhost:27017';

const connectDB = async() => {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log('MongoDB is now conneted.')

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

connectDB();

app.get('/slist', async(req, res) => {
    const client = new MongoClient(uri);
    await client.connect();
    const objects = await client.db('hotel_data').collection('zon').find({}).sort({"hotel": -1}).limit(500).toArray();
    await client.close();
    res.status(200).send(objects);

})

app.post('/slist/create', async(req, res) => {
    const object = req.body;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('hotel_data').collection('data').insertOne({
        "Created_Date":object ["Created_Date"],
        "productid": object['productid'],
        "reservationstatusdate": object['reservationstatusdate'],
        "category": object['category'],
        "discountedprice": object['discountedprice'],
        "country": object['actualprice'],
        "discountpercentage": object['discountpercentage'],
        "rating": object['rating'],
    });

    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "Object is created",
        "object": object['hotel']
    })
})

app.delete('/slist/delete', async(req, res) => {
    const id = req.body._id;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('hotel_data').collection('zon').deleteOne({"_id": ObjectId.createFromHexString(id)});
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "Object with ID"+ id + " is deleted."
    });
})

//// ที่อยุ่ของข้อมูล

app.get('/slist/:id', async(req, res) => {
    const id = req.params.id;
    const client = new MongoClient(uri);
    await client.connect();
    const object = await client.db('hotel_data').collection('zon').findOne({ "_id": ObjectId.createFromHexString(id) });
    await client.close();
    res.status(200).send({
        "status": "ok",
        "ID": id,
        "Complaint": object
    });
})

//// อัปเดตข้อมูล

app.put('/slist/update', async(req, res) => {
    const object = req.body;
    const id = object._id;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('hotel').collection('zon').updateOne({'_id': ObjectId.createFromHexString(id)}, 
    {"$set": {
        "Created_Date":object ["Created_Date"],
        "productid":object ["productid"],
        "productname":object ["productname"],
        "category":object ["category"],
        "discountedprice":object ["discountedprice"],
        "actualprice":object ["actualprice"],
        "discountpercentage":object ["discountpercentage"],
        "rating":object ["rating"],
    }});
    await client.close();
    res.status(200).send({
        'status': "ok",
        'message': "Object with ID "+id+" is updated.",
        'object': object
    });
})

app.get('/slist/field/:searchText', async(req, res) => {
    const { params } = req;
    const searchText = params.searchText
    const client = new MongoClient(uri);
    await client.connect();
    const regex = new RegExp(searchText, 'i');
    const objects = await client.db('hotel_data').collection('zon').find({ $or:[{"productname": regex},{"actualprice": regex}] }).sort({"hotel":-1}).limit(500).toArray();
    await client.close();
    res.status(200).send({
    "status": "ok",
    "searchText": searchText,
    "Complaint": objects
    });
});


