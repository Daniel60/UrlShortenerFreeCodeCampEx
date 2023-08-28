require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("dns");
const bodyParser = require("body-parser");

const listUrlSaved = {};
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.post("/api/shorturl", function (req, res) {
  const url = new URL(req.body.url);
  resp_json = {};
  dns.lookup(url.hostname, function (err, address) {
    if (err) {
      resp_json = { error: "invalid url" };
      res.json(resp_json);
    } else {
      const urlId = Object.keys(listUrlSaved).length + 1;
      listUrlSaved[urlId] = url;
      resp_json = { original_url: url, short_url: urlId };
      res.json(resp_json);
    }
  });
});

app.get("/api/shorturl/:short_url", function (req, res) {
  const short_url = req.params.short_url;
  const urlProtocol = listUrlSaved[short_url];
  resp_json = {};
  if (urlProtocol) {
    console.log("redirect", urlProtocol);
    res.redirect(urlProtocol);
  } else {
    resp_json = { error: "invalid url" };
    res.json(resp_json);
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
