const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// ===============================
// IDEAMART CONFIG
// ===============================

const APP_ID = "APP_068109";
const PASSWORD = "Chamindu@2004";

const NETLIFY_URL =
  "https://euphonious-youtiao-90caed.netlify.app";

// ===============================
// OTP REQUEST
// ===============================

app.post("/api/request-otp", async (req, res) => {
  try {
    let mobile = req.body.mobile || req.body.phoneNumber;

    console.log("OTP Request Received:", mobile);

    if (!mobile) {
      return res.status(400).json({
        status: "ERROR",
        message: "Mobile number missing",
      });
    }

    // FORMAT NUMBER
    if (mobile.startsWith("0")) {
      mobile = "94" + mobile.substring(1);
    }

    const formattedNumber = `tel:${mobile}`;

    const payload = {
      applicationId: APP_ID,
      password: PASSWORD,
      subscriberId: formattedNumber,

      applicationHash: "1234567890abcdef",

      applicationMetaData: {
        client: "WEB",
        device: "DESKTOP",
        os: "WINDOWS",
        appCode: NETLIFY_URL,
      },
    };

    console.log(
      "SENDING TO IDEAMART:",
      JSON.stringify(payload, null, 2)
    );

    const response = await axios.post(
      "https://api.ideamart.io/subscription/otp/request",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("IDEAMART RESPONSE:");
    console.log(response.data);

    res.json(response.data);
  } catch (error) {
    console.log("OTP ERROR");

    if (error.response) {
      console.log(error.response.data);

      return res.status(500).json(error.response.data);
    }

    console.log(error.message);

    res.status(500).json({
      error: error.message,
    });
  }
});

// ===============================
// VERIFY OTP
// ===============================

app.post("/api/verify-otp", async (req, res) => {
  try {
    const { referenceNo, otp } = req.body;

    console.log("VERIFY REQUEST:", referenceNo, otp);

    const payload = {
      applicationId: APP_ID,
      password: PASSWORD,
      referenceNo: referenceNo,
      otp: otp,
    };

    console.log(
      "VERIFY PAYLOAD:",
      JSON.stringify(payload, null, 2)
    );

    const response = await axios.post(
      "https://api.ideamart.io/subscription/verify",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("VERIFY RESPONSE:");
    console.log(response.data);

    res.json(response.data);
  } catch (error) {
    console.log("VERIFY ERROR");

    if (error.response) {
      console.log(error.response.data);

      return res.status(500).json(error.response.data);
    }

    console.log(error.message);

    res.status(500).json({
      error: error.message,
    });
  }
});

// ===============================
// UNSUBSCRIBE
// ===============================

app.post("/api/unsubscribe", async (req, res) => {
  try {
    let mobile = req.body.mobile || req.body.phoneNumber;

    console.log("UNSUBSCRIBE REQUEST:", mobile);

    if (!mobile) {
      return res.status(400).json({
        status: "ERROR",
        message: "Mobile number missing",
      });
    }

    if (mobile.startsWith("0")) {
      mobile = "94" + mobile.substring(1);
    }

    const formattedNumber = `tel:${mobile}`;

    const payload = {
      applicationId: APP_ID,
      password: PASSWORD,
      subscriberId: formattedNumber,
    };

    console.log(
      "UNSUBSCRIBE PAYLOAD:",
      JSON.stringify(payload, null, 2)
    );

    const response = await axios.post(
      "https://api.ideamart.io/subscription/base/request",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("UNSUBSCRIBE RESPONSE:");
    console.log(response.data);

    res.json(response.data);
  } catch (error) {
    console.log("UNSUBSCRIBE ERROR");

    if (error.response) {
      console.log(error.response.data);

      return res.status(500).json(error.response.data);
    }

    console.log(error.message);

    res.status(500).json({
      error: error.message,
    });
  }
});

// ===============================
// SERVER START
// ===============================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
