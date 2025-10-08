import "./style.css";

document.querySelector("#subscribe-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const status = document.querySelector("#status");

    // később ide jöhet a Brevo API-hívás
    console.log("Submitting:", { name, email });

    status.textContent = "Köszönjük! Hamarosan jelentkezünk.";
    e.target.reset();
});
