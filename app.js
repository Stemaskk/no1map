// ---------- helpers ----------
function collectForm(formEl) {
    const data = {};
    const fd = new FormData(formEl);
    for (const [name, value] of fd.entries()) {
        if (data[name]) {
            if (Array.isArray(data[name])) data[name].push(value);
            else data[name] = [data[name], value];
        } else data[name] = value;
    }
    return data;
}

function normalizeLower(s){ return (s||"").trim().toLowerCase(); }
function digitsOnly(s){ return (s||"").toString().replace(/\D/g,""); }

// ---------- correct answers ----------
const correct = {
    "q-smith": "22",                                  // Q1
    // Q2: accept any one of these bus numbers typed in any format
    "q-buses-any": ["210", "211", "217"],
    "q-shc": "NC 1214",                               // Q3
    "q-b20": "ohlone college foundation",             // Q4 (case-insensitive)
    "q-way": "Building 4"                             // Q5
};

const REDIRECT_URL = "https://ohlonecicada.netlify.app/";

// ---------- overall checker ----------
function allAnswersCorrect(ans) {
    // Q1 numeric
    const q1 = digitsOnly(ans["q-smith"]) === correct["q-smith"];

    // Q2 buses: accept if input contains any one of 210/211/217
    const typedBusDigits = digitsOnly(ans["q-buses"]);
    const q2 = correct["q-buses-any"].includes(typedBusDigits);

    // Q3 MC
    const q3 = (ans["q-shc"] || "") === correct["q-shc"];

    // Q4 text (case-insensitive)
    const q4 = normalizeLower(ans["q-b20"]) === correct["q-b20"];

    // Q5 MC
    const q5 = (ans["q-way"] || "") === correct["q-way"];

    return q1 && q2 && q3 && q4 && q5;
}

// ---------- modal controls ----------
const overlay = document.getElementById("modal-overlay");
const modal = document.getElementById("access-modal");
const okBtn = document.getElementById("modal-ok");
function showModal(){ overlay.classList.remove("hidden"); modal.classList.remove("hidden"); overlay.setAttribute("aria-hidden","false"); }
function hideModal(){ overlay.classList.add("hidden"); modal.classList.add("hidden"); overlay.setAttribute("aria-hidden","true"); }

// ---------- wire up ----------
const form = document.getElementById("quiz-form");
const results = document.getElementById("results");
const resetAll = document.getElementById("resetAll");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = allAnswersCorrect(collectForm(form));
    results.textContent = ok ? "All correct! 🎉" : "Not quite — try again.";
    results.scrollIntoView({ behavior: "smooth", block: "nearest" });
    if (ok) showModal(); // shows SPORP
});

okBtn.addEventListener("click", () => {
    hideModal();
    window.location.href = REDIRECT_URL;
});

overlay.addEventListener("click", hideModal);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideModal(); });

resetAll.addEventListener("click", () => {
    form.reset();
    results.textContent = "";
    hideModal();
});
