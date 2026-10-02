function showLead() {
  document.getElementById("chapter3Lead").hidden = false;
  ["A", "B", "C"].forEach((key) => {
    document.getElementById(`chapter3Outcome${key}`).hidden = true;
  });
  Qin.playBgm();
}

function showEnding(id, withSound) {
  document.getElementById("chapter3Lead").hidden = true;
  ["A", "B", "C"].forEach((key) => {
    document.getElementById(`chapter3Outcome${key}`).hidden = key !== id;
  });
  if (id === "A" || id === "B") {
    Qin.markSeenEnding(id === "A" ? "ch3-a" : "ch3-b");
    if (withSound === false) {
      if (window.syncBgm) window.syncBgm(true);
    } else {
      Qin.playCheer();
    }
  } else if (withSound !== false) {
    Qin.playFail();
  }
  document.querySelector(".page-stage").scrollTop = 0;
}

document.getElementById("backBtn").addEventListener("click", () => {
  const onEnding = ["A", "B", "C"].some((key) => !document.getElementById(`chapter3Outcome${key}`).hidden);
  if (onEnding) {
    showLead();
    return;
  }
  location.href = "chapter2.html";
});

document.getElementById("choiceMerit").addEventListener("click", () => showEnding("A"));
document.getElementById("choiceFarm").addEventListener("click", () => showEnding("B"));
document.getElementById("choiceTrade").addEventListener("click", () => showEnding("C"));

document.querySelectorAll(".ending__next").forEach((button) => {
  button.addEventListener("click", () => {
    const from = button.dataset.from === "b" ? "b" : "a";
    location.href = `finale.html?from=${from}`;
  });
});

document.querySelectorAll(".replay-btn").forEach((button) => {
  button.addEventListener("click", () => {
    Qin.markSeenEnding(button.dataset.ending);
    location.href = "index.html?view=main";
  });
});

const ending = new URLSearchParams(location.search).get("ending");
if (ending === "a" || ending === "b") {
  showEnding(ending.toUpperCase(), false);
} else {
  Qin.playBgm();
}
