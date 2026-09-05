// ── 语言 → Web Speech API locale 映射 ──
const LANG_MAP = {
  ko: "ko-KR",
  yue: "zh-HK",
  en: "en-US",
  de: "de-DE",
  fr: "fr-FR",
  es: "es-ES",
  it: "it-IT",
  ru: "ru-RU",
  ar: "ar-SA",
  th: "th-TH",
  pt: "pt-BR",
  he: "he-IL"
};

// ── DOM ──
const phraseSelect = document.getElementById("phraseSelect");
const langSelect = document.getElementById("langSelect");
const toggleMoreLangsBtn = document.getElementById("toggleMoreLangs");
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

const voiceWarning = document.createElement("p");
voiceWarning.id = "voiceWarning";
voiceWarning.hidden = true;
voiceWarning.style.cssText =
  "margin-top:0.75rem;font-size:0.875rem;color:#dc2626;text-align:center;line-height:1.5;";
speakBtn.insertAdjacentElement("afterend", voiceWarning);

let currentEntry = null;
let currentAudio = null;
let availableVoices = [];
let showMoreLangs = false;

function loadVoices() {
  availableVoices = window.speechSynthesis.getVoices();
}

loadVoices();
window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

const chineseOptions = [...new Set(phrases.map(p => p.chinese))];

chineseOptions.forEach(c => {
  const opt = document.createElement("option");
  opt.value = c;
  opt.textContent = c;
  phraseSelect.appendChild(opt);
});

function isLangVisible(lang) {
  return lang.enabled !== false || showMoreLangs;
}

function hasHiddenLanguages() {
  return LANGUAGES.some(l => l.enabled === false);
}

function populateLangSelect() {
  const previous = langSelect.value;
  langSelect.innerHTML = '<option value="">— 请选择 —</option>';

  LANGUAGES.forEach(l => {
    if (!isLangVisible(l)) return;
    const opt = document.createElement("option");
    opt.value = l.id;
    opt.textContent = l.name;
    langSelect.appendChild(opt);
  });

  if (previous && [...langSelect.options].some(o => o.value === previous)) {
    langSelect.value = previous;
  } else {
    langSelect.value = "";
  }
}

function updateMoreLangsButton() {
  if (!hasHiddenLanguages()) {
    toggleMoreLangsBtn.hidden = true;
    return;
  }
  toggleMoreLangsBtn.hidden = false;
  toggleMoreLangsBtn.textContent = showMoreLangs ? "收起更多语言" : "显示更多语言";
  toggleMoreLangsBtn.setAttribute("aria-expanded", showMoreLangs ? "true" : "false");
}

populateLangSelect();
updateMoreLangsButton();

function getLangMeta(langId) {
  return LANGUAGES.find(l => l.id === langId);
}

function getLocaleForLang(langId) {
  return LANG_MAP[langId] || getLangMeta(langId)?.lang || langId;
}

function normalizeLang(lang) {
  return lang.replace(/_/g, "-").toLowerCase();
}

function selectVoice(locale) {

  const target = normalizeLang(locale);

  const prefix = target.split("-")[0] + "-";

  const candidates = availableVoices.filter(v => {

    const lang = normalizeLang(v.lang);

    return lang === target || lang.startsWith(prefix);

  });

  // 法语优先使用 Thomas（Daniel 在 Chrome 上有时无声）

  if (target === "fr-fr") {

    return (

      candidates.find(v => v.name === "Thomas") ||

      candidates.find(v => v.name === "Amélie") ||

      candidates.find(v => v.name === "Thomas (Enhanced)") ||

      candidates.find(v => v.name !== "Daniel") ||

      candidates[0] ||

      null

    );

  }

  return candidates[0] || null;

}

function showVoiceWarning(langId) {
  const meta = getLangMeta(langId);
  const name = meta ? meta.name : langId;
  voiceWarning.textContent = `当前浏览器没有可用的${name}语音`;
  voiceWarning.hidden = false;
}

function hideVoiceWarning() {
  voiceWarning.textContent = "";
  voiceWarning.hidden = true;
}

function logTTS(event, text, locale, voice, error) {
  console.log(`[TTS ${event}]`, text, locale, voice?.name ?? "(none)", voice?.lang ?? "(none)", error ?? "");
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
  original.dir = entry.lang === "ar" || entry.lang === "he" ? "rtl" : "ltr";
  meaning.textContent = entry.meaning;
  ipaEl.textContent = entry.ipa;
  katakanaEl.textContent = entry.katakana;
  romanizationEl.textContent = entry.romanization;
  scenarioEl.textContent = entry.scenario;
  knowledgeEl.textContent = entry.knowledge;
  renderDerived(entry.derived || []);
  hideVoiceWarning();

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
    hideVoiceWarning();
    return;
  }

  const entry = findEntry(chinese, langId);
  if (!entry) {
    currentEntry = null;
    card.classList.remove("visible");
    placeholder.textContent = "暂无该组合的数据，请在 phrases 数组中追加";
    placeholder.classList.remove("hidden");
    hideVoiceWarning();
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

function speakWithTTS(text, langId) {
  const locale = getLocaleForLang(langId);
  hideVoiceWarning();

  window.speechSynthesis.cancel();

  const voice = selectVoice(locale);
  if (!voice) {
    const meta = getLangMeta(langId);
    console.warn(
      `[TTS] 未找到 ${locale} 语音，拒绝使用错误 voice 朗读。` +
        `请在系统设置中安装${meta?.name || locale}语音包。`,
      "可用 voices:",
      availableVoices.map(v => `${v.name} (${v.lang})`)
    );
    showVoiceWarning(langId);
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale;
  utterance.voice = voice;
  utterance.rate = 0.85;

  utterance.onstart = () => {
    speakBtn.classList.add("speaking");
    logTTS("onstart", text, locale, voice);
  };
  utterance.onend = () => {
    speakBtn.classList.remove("speaking");
    logTTS("onend", text, locale, voice);
  };
  utterance.onerror = (e) => {
    speakBtn.classList.remove("speaking");
    logTTS("onerror", text, locale, voice, e.error || String(e));
  };

  window.speechSynthesis.speak(utterance);
}

function speak() {
  if (!currentEntry) return;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  window.speechSynthesis.cancel();
  speakBtn.classList.remove("speaking");

  const speakText = currentEntry.text.split("/")[0].trim();
  const langId = currentEntry.lang;

  if (currentEntry.audioFile) {
    currentAudio = new Audio(currentEntry.audioFile);
    currentAudio.playbackRate = 0.85;
    speakBtn.classList.add("speaking");
    currentAudio.onended = () => speakBtn.classList.remove("speaking");
    currentAudio.onerror = () => {
      speakBtn.classList.remove("speaking");
      speakWithTTS(speakText, langId);
    };
    currentAudio.play().catch(() => {
      speakBtn.classList.remove("speaking");
      speakWithTTS(speakText, langId);
    });
  } else {
    speakWithTTS(speakText, langId);
  }
}

phraseSelect.addEventListener("change", updateCard);
langSelect.addEventListener("change", updateCard);
toggleMoreLangsBtn.addEventListener("click", () => {
  showMoreLangs = !showMoreLangs;
  populateLangSelect();
  updateMoreLangsButton();
  updateCard();
});
console.log("[APP] app.js loaded", new Date().toISOString());

speakBtn.addEventListener("click", event => {

  event.preventDefault();

  console.log("[APP TTS click]", {

    currentEntry,

    text: currentEntry?.text,

    lang: currentEntry?.lang

  });

  speak();

});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopSpeech();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
