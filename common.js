(function () {
  const endingKey = "qin-seen-endings";
  let bgm = null;
  let soundOn = localStorage.getItem("qin-sound") !== "0";
  window.sfxOn = soundOn;

  function seenEndings() {
    try {
      const saved = JSON.parse(localStorage.getItem(endingKey));
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      return [];
    }
  }

  function renderSeenEndings() {
    const seen = new Set(seenEndings());
    document.querySelectorAll("[data-ending]").forEach((lamp) => {
      lamp.classList.toggle("is-lit", seen.has(lamp.dataset.ending));
    });
  }

  function markSeenEnding(endingId) {
    if (!endingId) return;
    const list = seenEndings();
    if (!list.includes(endingId)) {
      list.push(endingId);
      localStorage.setItem(endingKey, JSON.stringify(list));
    }
    renderSeenEndings();
  }

  function context() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!window.__sfxCtx) window.__sfxCtx = new Ctx();
    if (window.__sfxCtx.state === "suspended") window.__sfxCtx.resume();
    return window.__sfxCtx;
  }

  function playClick() {
    if (!window.sfxOn) return;
    const ctx = context();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.035);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  function playFail() {
    if (window.syncBgm) window.syncBgm(true);
    if (!window.sfxOn) return;
    const ctx = context();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(62, now + 0.7);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.62, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.9);
  }

  function playCheer() {
    if (window.syncBgm) window.syncBgm(true);
    if (!window.sfxOn) return;
    const ctx = context();
    if (!ctx) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.28, now + 0.05 + index * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.4);
    });
    const length = Math.floor(ctx.sampleRate * 1.3);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1400;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    for (let n = 0; n < 8; n++) {
      const t = now + 0.08 + n * 0.1;
      noiseGain.gain.exponentialRampToValueAtTime(0.5, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.06, t + 0.06);
    }
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 1.28);
  }

  function setupBgm() {
    bgm = document.createElement("audio");
    bgm.src = "assets/bgm.mp3";
    bgm.loop = true;
    bgm.preload = "auto";
    bgm.volume = 0.42;
    document.body.appendChild(bgm);
    const savedTime = Number(sessionStorage.getItem("qin-bgm-time") || 0);
    bgm.addEventListener("loadedmetadata", () => {
      if (savedTime > 0 && savedTime < bgm.duration) bgm.currentTime = savedTime;
    });
    window.addEventListener("pagehide", () => {
      if (bgm) sessionStorage.setItem("qin-bgm-time", String(bgm.currentTime || 0));
    });

    const soundBtn = document.getElementById("soundBtn");
    if (soundBtn) {
      soundBtn.classList.toggle("is-muted", !soundOn);
      soundBtn.setAttribute("aria-pressed", String(soundOn));
      soundBtn.setAttribute("aria-label", soundOn ? "배경음 끄기" : "배경음 켜기");
      soundBtn.textContent = soundOn ? "樂" : "靜";
      soundBtn.addEventListener("click", () => {
        soundOn = !soundOn;
        window.sfxOn = soundOn;
        localStorage.setItem("qin-sound", soundOn ? "1" : "0");
        soundBtn.classList.toggle("is-muted", !soundOn);
        soundBtn.setAttribute("aria-pressed", String(soundOn));
        soundBtn.setAttribute("aria-label", soundOn ? "배경음 끄기" : "배경음 켜기");
        soundBtn.textContent = soundOn ? "樂" : "靜";
        syncBgm(window.__resultPage);
      });
    }

    window.syncBgm = function syncBgm(isResult) {
      window.__resultPage = Boolean(isResult);
      if (!soundOn || window.__resultPage) {
        bgm.pause();
        return;
      }
      const playing = bgm.play();
      if (playing && typeof playing.catch === "function") playing.catch(() => {});
    };

    window.playBgm = function playBgm() {
      window.syncBgm(false);
    };
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("button")) playClick();
  });

  setupBgm();
  renderSeenEndings();

  window.Qin = {
    playClick,
    playFail,
    playCheer,
    playBgm: window.playBgm,
    markSeenEnding,
    renderSeenEndings
  };
})();
