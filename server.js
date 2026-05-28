const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("IdeaMart Backend Running");
});

app.post("/api/request-otp", (req, res) => {
  const { mobile } = req.body;

  console.log("OTP Requested For:", mobile);

  res.json({
    success: true,
    message: "OTP Sent Successfully"
  });
});

app.post("/api/verify-otp", (req, res) => {
  const { mobile, otp } = req.body;

  console.log("Verify OTP:", mobile, otp);

  res.json({
    success: true,
    message: "Subscription Successful"
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});