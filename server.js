const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// =======================
// IDEAMART CONFIG
// =======================

const APP_ID = "APP_068109";
const PASSWORD = "Chamindu@2004";

const NETLIFY_URL = "https://euphonious-youtiao-90caed.netlify.app";

// =======================
// REQUEST OTP
// =======================

app.post("/api/request-otp", async (req, res) => {

    try {

        let { mobile } = req.body;

        console.log("OTP Request Received:", mobile);

        if (!mobile) {
            return res.status(400).json({
                status: "ERROR",
                message: "Mobile number missing"
            });
        }

        // REMOVE +94
        if (mobile.startsWith("+94")) {
            mobile = mobile.replace("+94", "0");
        }

        // CONVERT 07XXXXXXXX -> 947XXXXXXXX
        if (mobile.startsWith("0")) {
            mobile = "94" + mobile.substring(1);
        }

        const requestData = {

            applicationId: APP_ID,

            password: PASSWORD,

            subscriberId: `tel:${mobile}`,

            applicationHash: "1234567890abcdef",

            applicationMetaData: {
                client: "APP",
                device: "MOBILE",
                os: "ANDROID",
                appCode: NETLIFY_URL
            }
        };

        console.log("SENDING TO IDEAMART:", requestData);

        const response = await axios.post(

            "https://api.dialog.lk/ideamart/otp/request",

            requestData,

            {
                headers: {
                    "Content-Type": "application/json"
                }
            }

        );

        console.log("IDEAMART RESPONSE:");
        console.log(response.data);

        res.json(response.data);

    } catch (error) {

        console.log("OTP ERROR");

        if (error.response) {

            console.log(error.response.data);

            res.status(500).json(error.response.data);

        } else {

            console.log(error.message);

            res.status(500).json({
                error: error.message
            });

        }

    }

});

// =======================
// VERIFY OTP
// =======================

app.post("/api/verify-otp", async (req, res) => {

    try {

        const { referenceNo, otp } = req.body;

        console.log("Verify OTP:", referenceNo, otp);

        const requestData = {

            applicationId: APP_ID,

            password: PASSWORD,

            referenceNo: referenceNo,

            otp: otp

        };

        const response = await axios.post(

            "https://api.dialog.lk/ideamart/otp/verify",

            requestData,

            {
                headers: {
                    "Content-Type": "application/json"
                }
            }

        );

        console.log("VERIFY RESPONSE:");
        console.log(response.data);

        res.json(response.data);

    } catch (error) {

        console.log("VERIFY ERROR");

        if (error.response) {

            console.log(error.response.data);

            res.status(500).json(error.response.data);

        } else {

            console.log(error.message);

            res.status(500).json({
                error: error.message
            });

        }

    }

});

// =======================
// UNSUBSCRIBE
// =======================

app.post("/api/unsubscribe", async (req, res) => {

    try {

        let { mobile } = req.body;

        console.log("UNSUBSCRIBE:", mobile);

        if (mobile.startsWith("+94")) {
            mobile = mobile.replace("+94", "0");
        }

        if (mobile.startsWith("0")) {
            mobile = "94" + mobile.substring(1);
        }

        const requestData = {

            applicationId: APP_ID,

            password: PASSWORD,

            subscriberId: `tel:${mobile}`

        };

        const response = await axios.post(

            "https://api.dialog.lk/ideamart/subscription/unsubscribe",

            requestData,

            {
                headers: {
                    "Content-Type": "application/json"
                }
            }

        );

        console.log("UNSUB RESPONSE:");
        console.log(response.data);

        res.json(response.data);

    } catch (error) {

        console.log("UNSUB ERROR");

        if (error.response) {

            console.log(error.response.data);

            res.status(500).json(error.response.data);

        } else {

            console.log(error.message);

            res.status(500).json({
                error: error.message
            });

        }

    }

});

// =======================
// ROOT
// =======================

app.get("/", (req, res) => {

    res.send("IdeaMart Backend Running");

});

// =======================
// START SERVER
// =======================

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});
