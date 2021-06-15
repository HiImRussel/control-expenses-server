const express = require("express");
const cors = require("cors");
const mongo = require("mongodb");
const passwordHash = require("password-hash");

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3030;

const client = new mongo.MongoClient("mongodb://localhost:27017", {
  useNewUrlParser: true,
});
client.connect();

app.post("/login", (req, res) => {
  const { login, password } = req.body;
  const db = client.db("saveMoneyApp");
  const users = db.collection("users");

  //login query
  users.findOne({ userLogin: login }, (err, data) => {
    if (err) res.json({ logged: false, errorMsg: "error" });
    else {
      if (data !== null) {
        if (passwordHash.verify(password, data.userPassword))
          res.json({
            logged: true,
            userName: data.userName,
            userRole: data.userRole,
            userId: data._id,
          });
        else res.json({ logged: false, errorMsg: "error" });
      } else {
        res.json({ logged: false, errorMsg: "error" });
      }
    }
  });
});

app.get("*", (req, res) => {
  res.send("404", 404);
});

app.post("*", (req, res) => {
  res.send("404", 404);
});

app.listen(port, () => {
  console.log(`server started at http://127.0.0.1:${port}`);
});