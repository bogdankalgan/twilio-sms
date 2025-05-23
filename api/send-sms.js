const twilio = require("twilio");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_FROM;

const client = twilio(accountSid, authToken);

export default  async function handeler(req, res) {
  if(req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      return res.status(200).end();
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if(req.method !== "POST") {
      return res.status(405).json({error: "Method not allowed"});
  }

  const {phone, message} = req.body;

  if(!phone || !message) {
      return res.status(400).json({error: "Missiong phone or message"});
  }

  try {
      const result = await client.messages.create({
          to: phone,
          from,
          body: message,
      })
      res.status(200).json({success: true, sid: result.sid});
  } catch (error) {
      console.error(error);
      return res.status(500).json({error: "SMS failed"});
  }
}