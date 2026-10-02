function showLead() {
  document.getElementById("chapter2Lead").hidden = false;
  document.getElementById("chapter2OutcomeB").hidden = true;
  document.getElementById("chapter2OutcomeC").hidden = true;
  Qin.playBgm();
}

function showEnding(id) {
  document.getElementById("chapter2Lead").hidden = true;
  document.getElementById("chapter2OutcomeB").hidden = id !== "B";
  document.getElementById("chapter2OutcomeC").hidden = id !== "C";
  Qin.playFail();
  document.querySelector(".page-stage").scrollTop = 0;
}

document.getElementById("backBtn").addEventListener("click", () => {
  const onEnding = !document.getElementById("chapter2OutcomeB").hidden || !document.getElementById("chapter2OutcomeC").hidden;
  if (onEnding) {
    showLead();
    return;
  }
  location.href = "chapter1.html";
});

document.getElementById("choiceReport").addEventListener("click", () => {
  location.href = "chapter3.html";
});

document.getElementById("choiceIgnore").addEventListener("click", () => showEnding("B"));
document.getElementById("choiceHide").addEventListener("click", () => showEnding("C"));

document.querySelectorAll(".replay-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const endingId = button.dataset.ending;
    Qin.markSeenEnding(endingId);
    location.href = "index.html?view=main";
  });
});

Qin.playBgm();
