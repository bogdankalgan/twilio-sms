const twilio = require("twilio");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_FROM;

const client = twilio(accountSid, authToken);

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { phone, message } = req.body;

    if (!phone || !message) {
        return res.status(400).json({ error: "Missing phone or message" });
    }

    try {
        const result = await client.messages.create({
            to: phone,
            from,
            body: message,
        });

        res.status(200).json({ success: true, sid: result.sid });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "SMS failed" });
    }
};