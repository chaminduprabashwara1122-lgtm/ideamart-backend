const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

app.post("/request-otp", async (req, res) => {
  try {

    let mobile = req.body.mobile;

    console.log("OTP Request Received:", mobile);

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number required"
      });
    }

    if (mobile.startsWith("0")) {
      mobile = "94" + mobile.substring(1);
    }

    const payload = {
      applicationId: "APP_068109",
      password: "Chamindu2004",
      subscriberId: `tel:${mobile}`,
      applicationHash: "1234567890abcdef",
      applicationMetaData: {
        client: "APP",
        device: "ANDROID",
        os: "ANDROID",
        appCode: "test"
      }
    };

    console.log("SENDING TO IDEAMART:", payload);

    // ✅ CORRECT URL
    const response = await axios.post(
      "https://api.dialog.lk/ideamart/otp/request",
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("IDEAMART RESPONSE:", response.data);

    res.json(response.data);

  } catch (err) {

    console.log("OTP ERROR");

    if (err.response) {
      console.log(err.response.data);
      res.status(500).json(err.response.data);
    } else {
      console.log(err.message);
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }
});

app.post("/verify-otp", async (req, res) => {
  try {

    let mobile = req.body.mobile;
    const otp = req.body.otp;

    if (mobile.startsWith("0")) {
      mobile = "94" + mobile.substring(1);
    }

    const payload = {
      applicationId: "APP_068109",
      password: "Chamindu2004",
      subscriberId: `tel:${mobile}`,
      otp: otp
    };

    const response = await axios.post(
      "https://api.dialog.lk/ideamart/otp/verify",
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("VERIFY RESPONSE:", response.data);

    res.json(response.data);

  } catch (err) {

    console.log("VERIFY ERROR");

    if (err.response) {
      console.log(err.response.data);
      res.status(500).json(err.response.data);
    } else {
      console.log(err.message);
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
