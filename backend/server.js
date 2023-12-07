const express = require('express');

const users = require('./apis/users');
const statusUpdates = require('./apis/updates');
const app = express();
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser');


const mongoDBEndpoint = 'mongodb+srv://project3:banana1234@cluster0.e5xizox.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoDBEndpoint,  { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use('/api/users/', users)
app.use('/api/status/', statusUpdates)


let frontend_dir = path.join(__dirname, '..', 'frontend', 'dist')

app.use(express.static(frontend_dir));
app.get('*', function (req, res) {
    console.log("received request");
    res.sendFile(path.join(frontend_dir, "index.html"));
});



app.listen(process.env.PORT || 8000, function() {
    console.log("Starting server now...")
})


