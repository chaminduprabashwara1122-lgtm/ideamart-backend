const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

const APP_ID = "APP_068109";

const PASSWORD = "Chamindu@2004";

const NETLIFY_URL =
  "https://euphonious-youtiao-90caed.netlify.app";

let savedReferenceNo = "";


// HOME ROUTE

app.get("/", (req, res) => {

  res.send("IdeaMart Backend Running");

});


// ========================
// REQUEST OTP
// ========================

app.post("/api/request-otp", async (req, res) => {

  try {

    let { phoneNumber } = req.body;

    console.log("RAW NUMBER:", phoneNumber);

    // Convert 078xxxxxxx -> 9478xxxxxxx

    if (phoneNumber.startsWith("0")) {

      phoneNumber =
        "94" + phoneNumber.substring(1);

    }

    // Add tel:

    const formattedNumber =
      `tel:${phoneNumber}`;

    console.log(
      "FORMATTED NUMBER:",
      formattedNumber
    );

    // PAYLOAD

    const payload = {

      applicationId: APP_ID,

      password: PASSWORD,

      subscriberId: formattedNumber,

      applicationHash: "123456",

      applicationMetaData: {

        client: "WEB",

        device: "PC",

        os: "WINDOWS",

        appCode: NETLIFY_URL

      }

    };

    console.log(
      "OTP REQUEST PAYLOAD:"
    );

    console.log(
      JSON.stringify(payload, null, 2)
    );

    // SEND REQUEST

    const response = await axios.post(

      "https://api.ideamart.io/subscription/otp/request",

      payload,

      {

        headers: {

          "Content-Type":
            "application/json"

        }

      }

    );

    console.log(
      "IDEAMART OTP RESPONSE:"
    );

    console.log(response.data);

    // SAVE REFERENCE NUMBER

    savedReferenceNo =
      response.data.referenceNo;

    // SEND TO FRONTEND

    res.json(response.data);

  } catch (error) {

    console.log("OTP REQUEST ERROR");

    if (error.response) {

      console.log(
        error.response.data
      );

      res.status(500).json(
        error.response.data
      );

    } else {

      console.log(error.message);

      res.status(500).json({

        error: error.message

      });

    }

  }

});


// ========================
// VERIFY OTP
// ========================

app.post("/api/verify-otp", async (req, res) => {

  try {

    const { otp } = req.body;

    const payload = {

      applicationId: APP_ID,

      password: PASSWORD,

      referenceNo:
        savedReferenceNo,

      otp: otp

    };

    console.log(
      "VERIFY PAYLOAD:"
    );

    console.log(
      JSON.stringify(payload, null, 2)
    );

    const response = await axios.post(

      "https://api.ideamart.io/subscription/otp/verify",

      payload,

      {

        headers: {

          "Content-Type":
            "application/json"

        }

      }

    );

    console.log(
      "VERIFY RESPONSE:"
    );

    console.log(response.data);

    res.json(response.data);

  } catch (error) {

    console.log("VERIFY ERROR");

    if (error.response) {

      console.log(
        error.response.data
      );

      res.status(500).json(
        error.response.data
      );

    } else {

      console.log(error.message);

      res.status(500).json({

        error: error.message

      });

    }

  }

});


// ========================
// UNSUBSCRIBE
// ========================

app.post("/api/unsubscribe", async (req, res) => {

  try {

    let { phoneNumber } = req.body;

    if (phoneNumber.startsWith("0")) {

      phoneNumber =
        "94" + phoneNumber.substring(1);

    }

    const formattedNumber =
      `tel:${phoneNumber}`;

    const payload = {

      applicationId: APP_ID,

      password: PASSWORD,

      subscriberId:
        formattedNumber

    };

    console.log(
      "UNSUBSCRIBE PAYLOAD:"
    );

    console.log(
      JSON.stringify(payload, null, 2)
    );

    const response = await axios.post(

      "https://api.ideamart.io/subscription/base/request",

      payload,

      {

        headers: {

          "Content-Type":
            "application/json"

        }

      }

    );

    console.log(
      "UNSUBSCRIBE RESPONSE:"
    );

    console.log(response.data);

    res.json(response.data);

  } catch (error) {

    console.log(
      "UNSUBSCRIBE ERROR"
    );

    if (error.response) {

      console.log(
        error.response.data
      );

      res.status(500).json(
        error.response.data
      );

    } else {

      console.log(error.message);

      res.status(500).json({

        error: error.message

      });

    }

  }

});


// START SERVER

app.listen(PORT, () => {

  console.log(
    `Server started on port ${PORT}`
  );

});
