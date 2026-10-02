const from = new URLSearchParams(location.search).get("from") === "b" ? "b" : "a";

document.getElementById("backBtn").addEventListener("click", () => {
  location.href = `chapter3.html?ending=${from}`;
});

Qin.playBgm();
