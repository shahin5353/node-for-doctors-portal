const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const ObjectId =  require('mongodb').ObjectId


const uri = process.env.DB_PATH;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

app.use(cors())
app.use(bodyParser.json())
app.get('/schedules', (req, res) => {
    client.connect(err => {
        const collection = client.db("doctors-portal").collection("schedules");
        collection.find().toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(documents);
            }
        })
    });
});
app.get('/appointments', (req, res) => {
    client.connect(err => {
        const collection = client.db("doctors-portal").collection("appointments");
        collection.find().sort({"date":-1}).toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(documents);
            }
        })
    });
});
app.post('/addSchedules', (req, res) => {
    const schedules = req.body
    client.connect(err => {
        const collection = client.db("doctors-portal").collection("schedules");
        collection.insert(schedules, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                console.log(result.ops);
                res.send(result.ops);
            }
        })
    })
})
app.post('/addAppointment', (req, res) => {
    const appointmentDetail = req.body
    appointmentDetail.postTime = new Date()
    appointmentDetail.status = "pending";
    appointmentDetail.prescription = null;
    appointmentDetail.visited = "false";
    client.connect(err => {
        const collection = client.db("doctors-portal").collection("appointments");
        collection.insertOne(appointmentDetail, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result.ops[0]);
            }
        })
    });
})
app.post('/updateStatus', (req, res) => {
    const appointment = req.body;
    client.connect(err => {
        const collection = client.db("doctors-portal").collection("appointments");
        collection.updateOne(
            { _id:ObjectId(appointment.id) }, 
            {
            $set: {  "status" : appointment.status },
            $currentDate: { "lastModified": true }
            },
          (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result);
                console.log(result);
            }
        })
    });
})
app.post('/updateVisited', (req, res) => {
    const visited = req.body;
    client.connect(err => {
        const collection = client.db("doctors-portal").collection("appointments");
        collection.updateOne(
            { _id:ObjectId(visited.id) }, 
            {
            $set: {  "visited" : visited.visitStatus },
            $currentDate: { "lastModified": true }
            },
          (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result);
                console.log(result);
            }
        })
    });
})
app.post('/updatePrescription', (req, res) => {
    const appointment = req.body;
    client.connect(err => {
        const collection = client.db("doctors-portal").collection("appointments");
        collection.updateOne(
            { _id:ObjectId(appointment.id) }, 
            {
            $set: {  "prescription" : appointment.prescription },
            $currentDate: { "lastModified": true }
            },
          (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result);
                console.log(result);
            }
        })
    });
})

app.post('/updateAppointment', (req, res) => {
    const appointment = req.body;
    console.log(appointment);
    client.connect(err => {
        const collection = client.db("doctors-portal").collection("appointments");
        collection.updateOne(
            { _id:ObjectId(appointment.id) }, 
            {
            $set: { "name" :appointment.name,"time" : appointment.time, "date":appointment.date, "phone" : appointment.phone },
            $currentDate: { "lastModified": true }
            },
          (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result);
            }
        })
    });
})
app.get('/patients', (req, res) => {
    client.connect(err => {
        const collection = client.db("doctors-portal").collection("patients");
        collection.find().toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(documents);
            }
        })
    });
});
app.get('/totalPatients', (req, res) => {
    client.connect(err => {
        const collection = client.db("doctors-portal").collection("patients");
        collection.countDocuments((err,countData)=>{
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                const total = [countData]
                res.send(total);
            }
            
            });
    });
});
app.post('/addPatient', (req, res) => {
    const patientDetails = req.body
    patientDetails.postTime = new Date()
    client.connect(err => {
        const collection = client.db("doctors-portal").collection("patients");
        collection.insertOne(patientDetails, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result.ops[0]);
            }
        })
    });
})


app.listen(process.env.PORT, () => console.log("Listening from port", process.env.PORT))

