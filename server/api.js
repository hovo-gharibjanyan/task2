const express = require('express');
const bodyParser = require('body-parser');
const studentRoute = require('./routes/studentRout');
const cors = require('cors');
const dotenv = require('dotenv');

const { getDb, connectToDb } = require('./db');
const app = express();

dotenv.config();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(studentRoute); // Use student routes

const PORT = process.env.PORT || 8000;

let db;
connectToDb((error) => {
    if (!error) {
        app.listen(PORT, (error) => {
            error ? console.log(error) : console.log(`The PORT ${PORT} is listening`);
        });
    }
    db = getDb();
});
