// ── DOM ──
    const phraseSelect = document.getElementById("phraseSelect");
    const langSelect = document.getElementById("langSelect");
    const placeholder = document.getElementById("placeholder");
    const card = document.getElementById("card");
    const langBadge = document.getElementById("langBadge");
    const original = document.getElementById("original");
    const meaning = document.getElementById("meaning");
    const ipaEl = document.getElementById("ipa");
    const katakanaEl = document.getElementById("katakana");
    const romanizationEl = document.getElementById("romanization");
    const scenarioEl = document.getElementById("scenario");
    const knowledgeEl = document.getElementById("knowledge");
    const derivedEl = document.getElementById("derived");
    const speakBtn = document.getElementById("speakBtn");

    let currentEntry = null;
    let currentAudio = null;

    const chineseOptions = [...new Set(phrases.map(p => p.chinese))];

    chineseOptions.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      phraseSelect.appendChild(opt);
    });

    LANGUAGES.forEach(l => {
      const opt = document.createElement("option");
      opt.value = l.id;
      opt.textContent = l.name;
      langSelect.appendChild(opt);
    });

    function getLangMeta(langId) {
      return LANGUAGES.find(l => l.id === langId);
    }

    function findEntry(chinese, langId) {
      return phrases.find(p => p.chinese === chinese && p.lang === langId);
    }

    function renderDerived(items) {
      derivedEl.innerHTML = "";
      items.forEach(item => {
        const li = document.createElement("li");
        if (typeof item === "string") {
          li.textContent = item;
        } else {
          li.innerHTML = `<span class="derived-original">${item.text}</span><span class="derived-meaning"> — ${item.meaning}</span>`;
        }
        derivedEl.appendChild(li);
      });
    }

    function renderCard(entry) {
      const meta = getLangMeta(entry.lang);
      langBadge.textContent = meta.name;
      original.textContent = entry.text;
      original.dir = entry.lang === "ar" ? "rtl" : "ltr";
      meaning.textContent = entry.meaning;
      ipaEl.textContent = entry.ipa;
      katakanaEl.textContent = entry.katakana;
      romanizationEl.textContent = entry.romanization;
      scenarioEl.textContent = entry.scenario;
      knowledgeEl.textContent = entry.knowledge;
      renderDerived(entry.derived || []);

      card.classList.add("visible");
      placeholder.classList.add("hidden");
    }

    function updateCard() {
      stopSpeech();
      const chinese = phraseSelect.value;
      const langId = langSelect.value;

      if (!chinese || !langId) {
        currentEntry = null;
        card.classList.remove("visible");
        placeholder.classList.remove("hidden");
        return;
      }

      const entry = findEntry(chinese, langId);
      if (!entry) {
        currentEntry = null;
        card.classList.remove("visible");
        placeholder.textContent = "暂无该组合的数据，请在 phrases 数组中追加";
        placeholder.classList.remove("hidden");
        return;
      }

      currentEntry = entry;
      renderCard(entry);
    }

    function stopSpeech() {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
      }
      window.speechSynthesis.cancel();
      speakBtn.classList.remove("speaking");
    }

    function speakWithTTS(text, langCode) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.85;

      utterance.onstart = () => speakBtn.classList.add("speaking");
      utterance.onend = () => speakBtn.classList.remove("speaking");
      utterance.onerror = () => speakBtn.classList.remove("speaking");

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }

    function speak() {
      if (!currentEntry) return;
      stopSpeech();

      const meta = getLangMeta(currentEntry.lang);
      const speakText = currentEntry.text.split("/")[0].trim();

      if (currentEntry.audioFile) {
        currentAudio = new Audio(currentEntry.audioFile);
        currentAudio.playbackRate = 0.85;
        speakBtn.classList.add("speaking");
        currentAudio.onended = () => speakBtn.classList.remove("speaking");
        currentAudio.onerror = () => {
          speakBtn.classList.remove("speaking");
          speakWithTTS(speakText, meta.lang);
        };
        currentAudio.play().catch(() => {
          speakBtn.classList.remove("speaking");
          speakWithTTS(speakText, meta.lang);
        });
      } else {
        speakWithTTS(speakText, meta.lang);
      }
    }

    phraseSelect.addEventListener("change", updateCard);
    langSelect.addEventListener("change", updateCard);
    speakBtn.addEventListener("click", speak);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopSpeech();
    });

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      });
    }
