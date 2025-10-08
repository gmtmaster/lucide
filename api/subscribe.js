export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Missing email" });
    }

    try {
        const response = await fetch("https://api.brevo.com/v3/contacts", {
            method: "POST",
            headers: {
                accept: "application/json",
                "api-key": process.env.BREVO_API_KEY,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                email,
                attributes: { FIRSTNAME: name },
                listIds: [3],
                updateEnabled: true,
            }),
        });

        const data = await response.json();
        console.log("✅ Brevo response:", data);

        res.status(200).json({ success: true, message: "Subscribed!" });
    } catch (err) {
        console.error("❌ Subscription error:", err);
        res.status(500).json({ error: "Subscription failed" });
    }
}
