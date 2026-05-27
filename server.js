const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("IdeaMart Backend Running");
});

app.post("/api/notify", (req, res) => {
  console.log(req.body);

  res.status(200).send("Notification Received");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});