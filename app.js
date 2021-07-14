require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const ipGeoSchema = mongoose.Schema({
  latitude: String,
  longitude: String,
  mapURI: String,
  ip: String,
});

const ipGeo = mongoose.model('ipGeo', ipGeoSchema);

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
  const { latitude, longitude, mapURI } = req.body;
  const ipData = new ipGeo({
    latitude,
    longitude,
    mapURI,
    ip: req.connection.remoteAddress,
  });
  ipData.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.send({ status: 'success' });
    }
  });
});

app.listen(PORT);
