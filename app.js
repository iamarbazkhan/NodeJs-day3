const cron = require("node-cron");
const fs = require("fs");
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config();
app.use(bodyParser.json());
const PORT = process.env.PORT;

let count=1;

cron.schedule("*/1 * * * *", () => {
  fs.appendFile("data.txt", `Data append ${count} time \n`, (err) => {
    if (err) {
      throw err;
    }
    console.log("Data appended");
    count++;
  });
});

// Routes

app.post("/create-token", (req, res) => {
  const jwtToken = jwt.sign(req.body, process.env.SECRET_ACCESS_KEY);
  res.status(200).json({ accessToken: jwtToken });
});

app.get("/check-token",verifyJwtToken, (req, res) => {
    if(!req.user){
        return res.status(400).json({
            reponse:"Not a valid user"
        })
    }
    return res.status(200).json({
        response:"Authorised successfully!!"
    })


});
function verifyJwtToken(req, res, next) {
    const headerData = req.headers["authorization"];
    const jwtString = headerData && headerData.split(" ")[1];
    if (jwtString === null) return res.senStatus(401);
    jwt.verify(jwtString, process.env.SECRET_ACCESS_KEY, (err, res) => {
      if (err) {
        req.user = false;
        next();
      }
      req.user = res;
      next();
    });
  }

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
