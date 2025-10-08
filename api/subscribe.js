export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { name, email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Missing email" });
        }

        console.log("📨 Subscribing:", email, "Name:", name);

        const response = await fetch("https://api.brevo.com/v3/contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "api-key": process.env.BREVO_API_KEY,
            },
            body: JSON.stringify({
                email,
                attributes: { FIRSTNAME: name || "" },
                listIds: [3],
                updateEnabled: true,
            }),
        });

        const rawText = await response.text();
        console.log("📜 Raw Brevo response:", rawText);

        let data = null;
        try {
            data = rawText ? JSON.parse(rawText) : null;
        } catch (parseErr) {
            console.error("❌ Failed to parse Brevo response:", parseErr.message);
            return res.status(502).json({
                success: false,
                message: "Brevo sent invalid JSON",
            });
        }

        // ⚠️ Brevo hibakezelés
        if (!response.ok) {
            console.error("⚠️ Brevo API Error:", data);
            return res.status(response.status).json({
                success: false,
                message: data?.message || "Brevo rejected the request",
                code: data?.code,
            });
        }

        // ✅ Sikeres feliratkozás
        console.log("✅ Brevo contact subscribed:", data);
        return res.status(200).json({ success: true, data });
    } catch (err) {
        console.error("❌ Server Error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Server error",
        });
    }
}
