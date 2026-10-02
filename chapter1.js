function showLead() {
  document.getElementById("chapter1Lead").hidden = false;
  document.getElementById("chapter1Choices").hidden = false;
  document.getElementById("chapter1Outcome").hidden = true;
  Qin.playBgm();
}

document.getElementById("backBtn").addEventListener("click", () => {
  if (!document.getElementById("chapter1Outcome").hidden) {
    showLead();
    return;
  }
  location.href = "index.html?view=main";
});

document.getElementById("choiceMove").addEventListener("click", () => {
  location.href = "chapter2.html";
});

document.getElementById("choiceWatch").addEventListener("click", () => {
  location.href = "chapter2.html";
});

document.querySelector(".replay-btn").addEventListener("click", () => {
  Qin.markSeenEnding("ch1-a");
  location.href = "index.html?view=main";
});

Qin.playBgm();
