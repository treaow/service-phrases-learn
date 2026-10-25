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
let activePlayback = null;

function loadVoices() {
  availableVoices = window.speechSynthesis?.getVoices() || [];
}

loadVoices();
window.speechSynthesis?.addEventListener("voiceschanged", loadVoices);

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

function showVoiceWarning(langId, warning = voiceWarning, message) {
  const meta = getLangMeta(langId);
  const name = meta ? meta.name : langId;
  warning.textContent = message || `当前浏览器没有可用的${name}语音`;
  warning.hidden = false;
}

function hideVoiceWarning(warning = voiceWarning) {
  warning.textContent = "";
  warning.hidden = true;
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

// 主词库保留原有 selectVoice / Thomas 规则；地区词条先匹配精确 locale。
function selectRegionalVoice(locale, fallbackLocales = []) {
  const locales = [locale, ...fallbackLocales];
  for (const candidateLocale of locales) {
    const exact = availableVoices.filter(v => normalizeLang(v.lang) === normalizeLang(candidateLocale));
    if (!exact.length) continue;
    if (normalizeLang(candidateLocale) === "fr-fr") return selectVoice(candidateLocale);
    return exact[0];
  }
  // 只允许同一语言的 voice；nb-NO / no-NO 别名由数据明确指定。
  for (const candidateLocale of locales) {
    const voice = selectVoice(candidateLocale);
    if (voice) return voice;
  }
  return null;
}

function setSpeaking(playback, speaking) {
  playback.button.classList.toggle("speaking", speaking);
  playback.button.setAttribute("aria-busy", String(speaking));
}

function stopSpeech() {
  // 先清除身份，避免 cancel / pause 的延迟回调干扰下一次播放。
  const previous = activePlayback;
  activePlayback = null;
  if (previous) setSpeaking(previous, false);
  if (currentAudio) {
    currentAudio.onended = null;
    currentAudio.onerror = null;
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  window.speechSynthesis?.cancel();
  speakBtn.classList.remove("speaking");
}

function speakWithTTS(text, langId, playback) {
  const entry = playback.entry;
  const locale = entry.ttsLang || getLocaleForLang(langId);
  hideVoiceWarning(playback.warning);
  loadVoices();
  const voice = entry.ttsLang
    ? selectRegionalVoice(locale, entry.ttsFallbacks)
    : selectVoice(locale);
  if (!voice || !("SpeechSynthesisUtterance" in window)) {
    console.warn(`[TTS] 未找到 ${locale} 语音，拒绝使用错误 voice 朗读。`);
    showVoiceWarning(playback.label, playback.warning);
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = entry.ttsLang ? voice.lang : locale;
  utterance.voice = voice;
  utterance.rate = 0.85;
  // 保持引用以兼容 Safari；所有结束回调只更新当前播放器。
  playback.utterance = utterance;
  utterance.onstart = () => {
    if (activePlayback !== playback) return;
    setSpeaking(playback, true);
    logTTS("onstart", text, locale, voice);
  };
  utterance.onend = () => {
    if (activePlayback !== playback) return;
    setSpeaking(playback, false);
    logTTS("onend", text, locale, voice);
  };
  utterance.onerror = e => {
    if (activePlayback !== playback) return;
    setSpeaking(playback, false);
    logTTS("onerror", text, locale, voice, e.error || String(e));
    if (e.error !== "canceled" && e.error !== "interrupted") {
      showVoiceWarning(playback.label, playback.warning, "发音未能播放，请重试或检查系统语音包。");
    }
  };
  window.speechSynthesis.speak(utterance);
}

// 录音优先 → 失败时 TTS：主词库和地区卡片共用此入口。
function playEntry(entry, button, warning, label) {
  stopSpeech();
  hideVoiceWarning(warning);
  const playback = { entry, button, warning, label };
  activePlayback = playback;
  const speakText = entry.text.split("/")[0].trim();
  const fallbackToTTS = () => {
    if (activePlayback !== playback || playback.usedTTS) return;
    playback.usedTTS = true;
    if (currentAudio) {
      currentAudio.onended = null;
      currentAudio.onerror = null;
      currentAudio.pause();
      currentAudio = null;
    }
    setSpeaking(playback, false);
    speakWithTTS(speakText, entry.lang, playback);
  };

  if (entry.audioFile) {
    currentAudio = new Audio(entry.audioFile);
    currentAudio.playbackRate = 0.85;
    setSpeaking(playback, true);
    currentAudio.onended = () => {
      if (activePlayback !== playback) return;
      setSpeaking(playback, false);
      currentAudio = null;
    };
    currentAudio.onerror = fallbackToTTS;
    currentAudio.play().catch(fallbackToTTS);
  } else {
    fallbackToTTS();
  }
}

function speak() {
  if (currentEntry) playEntry(currentEntry, speakBtn, voiceWarning, currentEntry.lang);
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


// ── 地区问候视图（hash 支持浏览器返回和 PWA 内部导航） ──
const mainView = document.getElementById("mainView");
const regionalView = document.getElementById("regionalView");
const regionDetailView = document.getElementById("regionDetailView");
const regionList = document.getElementById("regionList");
const regionalPhrases = document.getElementById("regionalPhrases");
const regionTitle = document.getElementById("regionTitle");

function regionalElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

REGIONS.forEach(region => {
  const link = regionalElement("a", "region-link");
  link.href = `#regional/${region.id}`;
  const flag = regionalElement("span", "region-flag", region.flag);
  flag.setAttribute("aria-hidden", "true");
  const label = regionalElement("span", "region-label");
  label.append(regionalElement("strong", "", region.name));
  const localName = regionalElement("small", "", region.localName);
  localName.lang = region.lang;
  localName.dir = region.dir || "auto";
  label.append(localName);
  const arrow = regionalElement("span", "", "→");
  arrow.setAttribute("aria-hidden", "true");
  link.append(flag, label, arrow);
  regionList.append(link);
});

function renderRegionalPhrase(entry, region) {
  const article = regionalElement("article", "card visible regional-card");
  const headingId = `regional-${entry.id}`;
  article.setAttribute("aria-labelledby", headingId);
  const main = regionalElement("div", "card-main");
  const heading = regionalElement("h3", "", entry.category);
  heading.id = headingId;
  const text = regionalElement("p", "card-original", entry.text);
  text.lang = entry.lang || region.lang;
  text.dir = entry.dir || region.dir || "auto";
  main.append(heading, text, regionalElement("p", "card-meaning", entry.meaning));
  const grid = regionalElement("div", "pronunciation-grid");
  [["IPA", entry.ipa, "ipa"], ["片假名", entry.katakana, "katakana"],
    ["罗马字 / 转写", entry.romanization, "full-width"]].forEach(([label, value, type]) => {
    const block = regionalElement("div", `pron-block ${type === "full-width" ? type : ""}`);
    const pronunciation = regionalElement("div", `pron-value ${type}`, value);
    pronunciation.dir = "ltr";
    if (type === "katakana") pronunciation.lang = "ja";
    block.append(regionalElement("div", "pron-label", label), pronunciation);
    grid.append(block);
  });
  const button = regionalElement("button", "btn-speak", "发音");
  button.type = "button";
  button.setAttribute("aria-label", `播放${region.name}“${entry.category}”发音`);
  button.setAttribute("aria-busy", "false");
  const warning = regionalElement("p", "voice-warning");
  warning.id = `warning-${entry.id}`;
  warning.hidden = true;
  warning.setAttribute("role", "status");
  button.setAttribute("aria-describedby", warning.id);
  button.addEventListener("click", () => playEntry(entry, button, warning, region.name));
  main.append(grid, button, warning);
  const extra = regionalElement("div", "card-extra");
  [["使用场景", entry.scenario], ["相关知识", entry.knowledge]].forEach(([title, body]) => {
    if (!body) return;
    const section = regionalElement("div", "extra-section");
    section.append(regionalElement("div", "extra-title", title), regionalElement("div", "extra-body", body));
    extra.append(section);
  });
  article.append(main, extra);
  return article;
}

function renderRoute(event) {
  stopSpeech();
  hideVoiceWarning();
  const route = window.location.hash;
  const region = REGIONS.find(r => route === `#regional/${r.id}`);
  const showList = route === "#regional" || (route.startsWith("#regional/") && !region);
  mainView.hidden = Boolean(region || showList);
  regionalView.hidden = !showList;
  regionDetailView.hidden = !region;
  let heading;
  if (region) {
    regionTitle.textContent = `${region.flag} ${region.name}`;
    const localName = document.getElementById("regionLocalName");
    localName.textContent = region.localName;
    localName.lang = region.lang;
    localName.dir = region.dir || "auto";
    document.getElementById("regionNote").textContent = region.note;
    document.getElementById("regionTTSNote").textContent = region.ttsNote;
    regionalPhrases.replaceChildren(...REGIONAL_PHRASES.filter(p => p.region === region.id)
      .map(entry => renderRegionalPhrase(entry, region)));
    heading = regionTitle;
    document.title = `${region.name} · 地区特色问候`;
  } else {
    regionalPhrases.replaceChildren();
    heading = showList ? document.getElementById("regionalTitle") : document.getElementById("regionalEntry");
    document.title = showList ? "地区特色问候 · 服务用语学习" : "服务用语学习";
  }
  if (event || route) {
    window.scrollTo(0, 0);
    heading.focus({ preventScroll: true });
  }
}
window.addEventListener("hashchange", renderRoute);
renderRoute();
