const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());

const dbURI = "mongodb://localhost:27017/user-data-collection";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((response) => {
    console.log("Database connected succssfully ");
  })
  .catch((err) => {
    console.log("Database connection failed " + err);
  });

app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      place: req.body.place,
    });

    res.json({ status: "ok" });
  } catch (error) {
    res.json({
      status: "error",
      error: error,
    });
  }
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        products: user.products,
      },
      "secret123"
    );

    return res.json({
      status: "ok",
      user: true,
      userData: user,
      token: token,
    });
  } else {
    return res.json({
      status: "error",
      user: false,
    });
  }
});

app.post("/api/add-product", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;
    await User.updateOne(
      { email: email },
      {
        $addToSet: {
          products: [
            {
              name: req.body.name,
              price: req.body.price,
              quantity: req.body.quantity,
              category: req.body.category,
            },
          ],
        },
      }
    );
    res.json({ status: "ok", user: true });
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      error: "invalid token",
    });
  }
});

app.get("/api/list-product", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    res.json({ status: "ok", user: true, userData: user });
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      error: "invalid token",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
