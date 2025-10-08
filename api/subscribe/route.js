// ❌ Express helyett natív Vercel API route
// ✅ Ugyanazt a logikát tartalmazza, mint az eredeti Express verzió

export async function POST(req) {
    const { name, email } = await req.json();

    if (!email) {
        return new Response(
            JSON.stringify({ error: "Missing email" }),
            { status: 400 }
        );
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

        return new Response(
            JSON.stringify({ success: true, message: "Subscribed!" }),
            { status: 200 }
        );
    } catch (err) {
        console.error("❌ Error while subscribing:", err);
        return new Response(
            JSON.stringify({ error: "Subscription failed" }),
            { status: 500 }
        );
    }
}

