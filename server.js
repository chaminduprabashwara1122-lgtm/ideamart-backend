const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// =========================
// IDEAMART CONFIG
// =========================

const APP_ID = "APP_068109";
const PASSWORD = "Chamindu@2004";

const NETLIFY_URL = "https://euphonious-youtiao-90caed.netlify.app";

// =========================
// OTP REQUEST
// =========================

app.post("/api/request-otp", async (req, res) => {

    try {

        const { phoneNumber } = req.body;

        console.log("=================================");
        console.log("RAW NUMBER:", phoneNumber);

        let formattedNumber = phoneNumber.trim();

        if (formattedNumber.startsWith("0")) {

            formattedNumber =
                "tel:94" + formattedNumber.substring(1);

        } else if (!formattedNumber.startsWith("tel:")) {

            formattedNumber =
                "tel:" + formattedNumber;
        }

        console.log("FORMATTED NUMBER:", formattedNumber);

        const payload = {

            applicationId: APP_ID,

            password: PASSWORD,

            subscriberId: formattedNumber,

            applicationHash: "testhash123456",

            applicationMetaData: {

                client: "WEB",

                device: "PC",

                os: "WINDOWS",

                appCode: NETLIFY_URL
            }
        };

        console.log("OTP REQUEST PAYLOAD:");
        console.log(
            JSON.stringify(payload, null, 2)
        );

        const response = await axios.post(

            "https://api.ideamart.io/subscription/otp/request",

            payload,

            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("=================================");
        console.log("IDEAMART OTP RESPONSE:");
        console.log(response.data);

        res.status(200).json(response.data);

    } catch (error) {

        console.log("=================================");
        console.log("OTP REQUEST ERROR");

        if (error.response) {

            console.log("ERROR RESPONSE:");
            console.log(error.response.data);

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

// =========================
// VERIFY OTP
// =========================

app.post("/api/verify-otp", async (req, res) => {

    try {

        const { referenceNo, otp } = req.body;

        console.log("=================================");
        console.log("VERIFY OTP REQUEST");

        const payload = {

            applicationId: APP_ID,

            password: PASSWORD,

            referenceNo: referenceNo,

            otp: otp
        };

        console.log(
            JSON.stringify(payload, null, 2)
        );

        const response = await axios.post(

            "https://api.ideamart.io/subscription/otp/verify",

            payload,

            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("VERIFY RESPONSE:");
        console.log(response.data);

        res.status(200).json(response.data);

    } catch (error) {

        console.log("VERIFY ERROR");

        if (error.response) {

            console.log(error.response.data);

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

// =========================
// UNSUBSCRIBE
// =========================

app.post("/api/unsubscribe", async (req, res) => {

    try {

        const { phoneNumber } = req.body;

        let formattedNumber = phoneNumber.trim();

        if (formattedNumber.startsWith("0")) {

            formattedNumber =
                "tel:94" + formattedNumber.substring(1);

        } else if (!formattedNumber.startsWith("tel:")) {

            formattedNumber =
                "tel:" + formattedNumber;
        }

        console.log("=================================");
        console.log("UNSUBSCRIBE REQUEST");

        const payload = {

            applicationId: APP_ID,

            password: PASSWORD,

            subscriberId: formattedNumber
        };

        console.log(
            JSON.stringify(payload, null, 2)
        );

        const response = await axios.post(

            "https://api.ideamart.io/subscription/base/unregister",

            payload,

            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("UNSUBSCRIBE RESPONSE:");
        console.log(response.data);

        res.status(200).json(response.data);

    } catch (error) {

        console.log("UNSUBSCRIBE ERROR");

        if (error.response) {

            console.log(error.response.data);

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

// =========================

app.listen(PORT, () => {

    console.log(`Server started on port ${PORT}`);

});
