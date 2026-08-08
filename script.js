document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       OPEN SURPRISE
    ========================= */

    const openButton = document.getElementById("openSurprise");
    const surpriseContent = document.getElementById("surpriseContent");

    if (openButton && surpriseContent) {

        openButton.addEventListener("click", function () {

    surpriseContent.style.display = "block";
    openButton.style.display = "none";

    document.body.classList.add("surprise-open");

    surpriseContent.scrollIntoView({
        behavior: "smooth"
    });

    // Congratulations animation
    congratulations();

    // Lots of hearts
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createFloatingHeart();
        }, i * 150);
    }

});


    /* =========================
       PAGE / SCREEN SYSTEM
    ========================= */

    function setupPages() {

        const pages = document.querySelectorAll(
            "#surpriseContent > section"
        );

        if (!pages.length) return;

        pages.forEach(function (page, index) {

            page.classList.add("birthday-page");

            if (index === 0) {
                page.classList.add("active-page");
            } else {
                page.classList.remove("active-page");
            }

            /* Add NEXT button except on final page */
            if (index < pages.length - 1) {

                let nextButton = page.querySelector(".next-page-btn");

                if (!nextButton) {

                    nextButton = document.createElement("button");

                    nextButton.className = "next-page-btn";

                    nextButton.innerHTML =
                        "Continue 💕";

                    page.appendChild(nextButton);
                }

                nextButton.onclick = function () {
                    showPage(index + 1);
                };
            }
        });

        /* Fix the YES / NO page */
        setupChanceGame();
    }


    function showPage(number) {

        const pages = document.querySelectorAll(
            "#surpriseContent > section"
        );

        if (!pages[number]) return;

        pages.forEach(function (page) {
            page.classList.remove("active-page");
        });

        pages[number].classList.add("active-page");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        pages[number].scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    /* =========================
       YES / NO CHANCE GAME
    ========================= */

    function setupChanceGame() {

        const yesBtn = document.getElementById("yesBtn");
        const noBtn = document.getElementById("noBtn");
        const answer = document.getElementById("answer");

        if (!yesBtn || !noBtn) return;

        let attempts = 0;

        const messages = [
            "No? 😂 Are you sure?",
            "Think again 😭💕",
            "Nice try 😂",
            "You can't escape this one 😌❤️",
            "Just say YES already 😂",
            "Linet pleaseee 🥹💕",
            "YES is right there 👉❤️"
        ];

        function moveNoButton(event) {

            if (event) {
                event.preventDefault();
            }

            attempts++;

            if (answer) {
                answer.innerHTML =
                    messages[Math.min(
                        attempts - 1,
                        messages.length - 1
                    )];
            }

            const padding = 25;

            const maxX =
                window.innerWidth -
                noBtn.offsetWidth -
                padding;

            const maxY =
                window.innerHeight -
                noBtn.offsetHeight -
                padding;

            const x =
                padding +
                Math.random() * Math.max(0, maxX - padding);

            const y =
                padding +
                Math.random() * Math.max(0, maxY - padding);

            noBtn.style.position = "fixed";
            noBtn.style.left = x + "px";
            noBtn.style.top = y + "px";
            noBtn.style.zIndex = "99999";
        }


        /* Laptop */
        noBtn.addEventListener(
            "mouseenter",
            moveNoButton
        );


        /* Phone */
        noBtn.addEventListener(
            "touchstart",
            moveNoButton,
            { passive: false }
        );


        /* YES */
        yesBtn.addEventListener("click", function () {

            if (answer) {
                answer.innerHTML =
                    "I KNEW IT 😂❤️💍<br><br>" +
                    "Okay Linet... looks like I have a chance now. 🥹💕";
            }

            createHearts();

            setTimeout(function () {

                const pages = document.querySelectorAll(
                    "#surpriseContent > section"
                );

                if (pages.length) {

                    pages.forEach(function (page) {
                        page.classList.remove("active-page");
                    });

                    pages[pages.length - 1]
                        .classList.add("active-page");

                    pages[pages.length - 1]
                        .scrollIntoView({
                            behavior: "smooth"
                        });
                }

            }, 1200);
        });
    }


    /* =========================
       HEART ANIMATION
    ========================= */

    function createHearts() {

        for (let i = 0; i < 25; i++) {

            const heart = document.createElement("div");

            heart.innerHTML =
                Math.random() > 0.5 ? "❤️" : "💕";

            heart.style.position = "fixed";
            heart.style.left =
                Math.random() * 100 + "vw";
            heart.style.bottom = "-30px";
            heart.style.fontSize =
                (20 + Math.random() * 25) + "px";
            heart.style.zIndex = "100000";
            heart.style.pointerEvents = "none";
            heart.style.transition =
                "transform 3s ease, opacity 3s ease";

            document.body.appendChild(heart);

            setTimeout(function () {

                heart.style.transform =
                    "translateY(-110vh) rotate(360deg)";

                heart.style.opacity = "0";

            }, 100);

            setTimeout(function () {
                heart.remove();
            }, 3200);
        }
    }

});

function playApplause() {

    const AudioContext =
        window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
        return;
    }

    const ctx = new AudioContext();

    // Make sure the phone allows the sound
    if (ctx.state === "suspended") {
        ctx.resume();
    }

    const master = ctx.createGain();

    master.gain.value = 0.45;

    master.connect(ctx.destination);


    function clap(delay) {

        // Short burst of noise = clap
        const bufferSize =
            ctx.sampleRate * 0.12;

        const buffer =
            ctx.createBuffer(
                1,
                bufferSize,
                ctx.sampleRate
            );

        const data =
            buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {

            const fade =
                Math.exp(-i / (ctx.sampleRate * 0.025));

            data[i] =
                (Math.random() * 2 - 1) * fade;
        }

        const source =
            ctx.createBufferSource();

        const filter =
            ctx.createBiquadFilter();

        const gain =
            ctx.createGain();

        source.buffer = buffer;

        filter.type = "highpass";
        filter.frequency.value = 900;

        gain.gain.setValueAtTime(
            0.001,
            ctx.currentTime + delay
        );

        gain.gain.exponentialRampToValueAtTime(
            0.9,
            ctx.currentTime + delay + 0.005
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            ctx.currentTime + delay + 0.11
        );

        source.connect(filter);
        filter.connect(gain);
        gain.connect(master);

        source.start(ctx.currentTime + delay);
        source.stop(ctx.currentTime + delay + 0.13);
    }


    // First burst
    for (let i = 0; i < 12; i++) {
        clap(i * 0.11);
    }

    // Second burst
    for (let i = 0; i < 14; i++) {
        clap(1.4 + i * 0.09);
    }

    // Finish
    for (let i = 0; i < 8; i++) {
        clap(2.7 + i * 0.08);
    }

    setTimeout(() => {
        ctx.close();
    }, 4000);
}