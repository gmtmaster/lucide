import express from "express";
import fetch from "node-fetch";
const router = express.Router();

router.post("/", async (req, res) => {
    const { name, email } = req.body;

    if (!email) return res.status(400).json({ error: "Missing email" });

    try {
        const response = await fetch("https://api.brevo.com/v3/contacts", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": process.env.BREVO_API_KEY, // ✅ hide your key in .env
                "content-type": "application/json",
            },
            body: JSON.stringify({
                email,
                attributes: { FIRSTNAME: name },
                listIds: [3], // ⚠️ replace with your actual Brevo list ID
                updateEnabled: true,
            }),
        });

        const data = await response.json();
        console.log("✅ Brevo response:", data);
        res.status(200).json({ success: true, message: "Subscribed!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Subscription failed" });
    }
});

export default router;
