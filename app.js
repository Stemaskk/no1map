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
    // ensure unchecked checkbox groups appear as empty arrays
    formEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (!fd.has(cb.name)) data[cb.name] = [];
    });
    return data;
}
function normalizeLower(s){ return (s||"").trim().toLowerCase(); }
function digitsOnly(s){ return (s||"").toString().replace(/\D/g,""); }
function sameSet(a = [], b = []) {
    const A = [...a].sort(); const B = [...b].sort();
    return JSON.stringify(A) === JSON.stringify(B);
}

// ---------- correct answers (same as your originals) ----------
const correct = {
    // Q1
    "q-smith": "22",
    // Q2 (MC)
    "q-shc": "NC 1214",
    // Q3 (digits only)
    "out-starbucks": "19",
    // Q4 (case-insensitive)
    "out-trail": "mission peak",
    // Q5 (checkbox set)
    "out-animals": ["Turtles","Koi Fish"]
};

// ---------- redirect ----------
const REDIRECT_URL = "https://clnh3.netlify.app/";

// ---------- overall checker ----------
function allAnswersCorrect(ans) {
    const q1 = digitsOnly(ans["q-smith"]) === correct["q-smith"];
    const q2 = (ans["q-shc"] || "") === correct["q-shc"];
    const q3 = digitsOnly(ans["out-starbucks"]) === correct["out-starbucks"];
    const q4 = normalizeLower(ans["out-trail"]) === correct["out-trail"];
    const q5 = sameSet(ans["out-animals"] || [], correct["out-animals"]);
    return q1 && q2 && q3 && q4 && q5;
}

// ---------- wire up ----------
const form = document.getElementById("quiz-form");
const results = document.getElementById("results");
const resetAll = document.getElementById("resetAll");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = allAnswersCorrect(collectForm(form));
    if (ok) {
        results.textContent = "All correct! Redirecting…";
        // immediate redirect (no popup)
        window.location.href = REDIRECT_URL;
    } else {
        results.textContent = "Not quite — try again.";
    }
    results.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

resetAll.addEventListener("click", () => {
    form.reset();
    results.textContent = "";
});
