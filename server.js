const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// =========================
// REQUEST OTP
// =========================
app.post("/api/request-otp", async (req, res) => {

  try {

    let { mobile } = req.body;

    console.log("OTP Request Received:", mobile);

    if (!mobile) {
      return res.json({
        success: false,
        message: "Mobile number missing"
      });
    }

    // 07XXXXXXXX -> 947XXXXXXXX
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

    const response = await axios.post(
      "https://ideamartotp.dialog.lk/subscribe",
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("IDEAMART RESPONSE:", response.data);

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {

    console.log("OTP ERROR");

    if (error.response) {
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }

    res.json({
      success: false,
      message: "OTP Failed"
    });
  }

});

// =========================
// VERIFY OTP
// =========================
app.post("/api/verify-otp", async (req, res) => {

  try {

    let { mobile, otp } = req.body;

    if (mobile.startsWith("0")) {
      mobile = "94" + mobile.substring(1);
    }

    const payload = {
      applicationId: "APP_068109",
      password: "Chamindu2004",
      subscriberId: `tel:${mobile}`,
      applicationHash: "1234567890abcdef",
      otp: otp
    };

    const response = await axios.post(
      "https://ideamartotp.dialog.lk/verify",
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("VERIFY RESPONSE:", response.data);

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {

    console.log("VERIFY ERROR");

    if (error.response) {
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }

    res.json({
      success: false,
      message: "OTP Verification Failed"
    });
  }

});

// =========================
// UNSUBSCRIBE
// =========================
app.post("/api/unsubscribe", async (req, res) => {

  try {

    let { mobile } = req.body;

    if (mobile.startsWith("0")) {
      mobile = "94" + mobile.substring(1);
    }

    const payload = {
      applicationId: "APP_068109",
      password: "Chamindu2004",
      subscriberId: `tel:${mobile}`
    };

    const response = await axios.post(
      "https://ideamartotp.dialog.lk/unsubscribe",
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("UNSUBSCRIBE RESPONSE:", response.data);

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {

    console.log("UNSUBSCRIBE ERROR");

    if (error.response) {
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }

    res.json({
      success: false,
      message: "Unsubscribe Failed"
    });
  }

});

// =========================
// START SERVER
// =========================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
