import gsap from "gsap";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

document.addEventListener("DOMContentLoaded", () => {
  const tl = gsap.timeline({
    delay: 0.3,
    defaults: {
      ease: "hop",
    },
  });

  const counts = document.querySelectorAll(".count");

  counts.forEach((count, index) => {
    const digits = count.querySelectorAll(".digit h1");

    tl.to(
      digits,
      {
        y: "0%",
        duration: 1,
        stagger: 0.075,
      },
      index * 1
    );

    if (index < counts.length) {
      tl.to(
        digits,
        {
          y: "-100%",
          duration: 1,
          stagger: 0.075,
        },
        index * 1 + 1
      );
    }
  });

  tl.to(".spinner", {
    opacity: 0,
    duration: 0.3,
  });

  tl.to(
    ".word h1",
    {
      y: "0%",
      duration: 1,
    },
    "<"
  );

  tl.to(".divider", {
    scaleY: "100%",
    duration: 1,
    onComplete: () =>
      gsap.to(".divider", { opacity: 0, duration: 0.3, delay: 0.3 }),
  });

  tl.to("#word-1 h1", {
    y: "100%",
    duration: 1,
    delay: 0.3,
  });

  tl.to(
    "#word-2 h1",
    {
      y: "-100%",
      duration: 1,
    },
    "<"
  );

  tl.to(
    ".block",
    {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1,
      stagger: 0.1,
      delay: 0.75,
      onStart: () =>
        gsap.to(".hero-img", { scale: 1, duration: 2, ease: "hop" }),
    },
    "<"
  );

  tl.to(
    [".nav", ".line h1", ".line p"],
    {
      y: "0%",
      duration: 1.5,
      stagger: 0.2,
    },
    "<"
  );

  tl.to(
    [".cta", ".cta-icon"],
    {
      scale: 1,
      duration: 1.5,
      stagger: 0.75,
      delay: 0.75,
    },
    "<"
  );

  tl.to(
    ".cta-label p",
    {
      y: "0%",
      duration: 1.5,
      delay: 0.5,
    },
    "<"
  );


    tl.to(".loader", {
        opacity: 0,
        duration: 0.6,
        pointerEvents: "none",
        onComplete: () => {
            gsap.set(".loader", { zIndex: -1 });
        },
    });
});

document
    .getElementById("subscribe-form")
    .addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const status = document.getElementById("status");

        status.textContent = "Küldés folyamatban...";

        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email }),
            });

            const data = await res.json();

            if (res.ok) {
                status.textContent = "✅ Köszönjük, hogy részese vagy egy történet kezdetének!";
            } else {
                status.textContent = "⚠️ Hiba történt: " + (data.error || "Ismeretlen hiba.");
            }
        } catch (err) {
            status.textContent = "❌ Hálózati hiba, próbáld újra később.";
            console.error(err);
        }

        e.target.reset();
    });
