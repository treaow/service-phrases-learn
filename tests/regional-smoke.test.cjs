// 零依赖回归测试：node --test tests/regional-smoke.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

// 只模拟 DOM 和浏览器边界；测试执行实际 app.js/data.js，不复制播放器实现。
class Element {
  constructor(tag = 'div') {
    this.tagName = tag; this.children = []; this.attrs = {}; this.value = '';
    this.style = {}; this.textContent = ''; this.hidden = false; this.listeners = {}; this.classes = new Set();
    this.classList = {
      add: c => this.classes.add(c), remove: c => this.classes.delete(c),
      contains: c => this.classes.has(c),
      toggle: (c, on) => on ? this.classes.add(c) : this.classes.delete(c)
    };
  }
  append(...nodes) { this.children.push(...nodes); }
  appendChild(node) { this.append(node); }
  replaceChildren(...nodes) { this.children = nodes; }
  insertAdjacentElement(_, node) { this.adjacent = node; }
  setAttribute(k, v) { this.attrs[k] = v; }
  addEventListener(k, fn) { this.listeners[k] = fn; }
  focus() { this.focused = true; }
  get options() { return this.children; }
  set innerHTML(html) { this.children = html.startsWith('<option') ? [new Element('option')] : []; }
}
function setup({ voices = [], speech = true } = {}) {
  const els = new Map();
  const audio = [], utterances = [], events = {};
  class Audio {
    constructor(src) { this.src = src; this.currentTime = 0; audio.push(this); }
    play() { return new Promise((resolve, reject) => { this.resolve = resolve; this.reject = reject; }); }
    pause() { this.paused = true; }
  }
  class SpeechSynthesisUtterance { constructor(text) { this.text = text; } }
  const synth = { getVoices: () => voices, addEventListener: (e, fn) => events[e] = fn,
    cancel() {}, speak: u => utterances.push(u) };
  const document = {
    getElementById: id => { if (!els.has(id)) els.set(id, new Element()); return els.get(id); },
    createElement: tag => new Element(tag), addEventListener() {}, hidden: false
  };
  const window = { location: { hash: '' }, scrollTo() {},
    addEventListener: (e, fn) => events[e] = fn };
  if (speech) Object.assign(window, { speechSynthesis: synth, SpeechSynthesisUtterance });
  const context = vm.createContext({ window, document, navigator: {}, Audio, SpeechSynthesisUtterance,
    console: { log() {}, warn() {} } });
  for (const file of ['data.js', 'regional-data.js', 'app.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, {filename:file});
  }
  return { run: code => vm.runInContext(code, context), els, audio, utterances, events, voices };
}
const voice = (name, lang) => ({name, lang});

test('8 regions, 32 complete entries, four ordered categories, unique IDs, no derived', () => {
  const s = setup();
  assert.equal(s.run('REGIONS.length'), 8);
  assert.equal(s.run('REGIONAL_PHRASES.length'), 32);
  assert.equal(s.run('new Set(REGIONAL_PHRASES.map(p => p.id)).size'), 32);
  assert.equal(s.run(`REGIONS.every(r => REGIONAL_PHRASES.filter(p => p.region === r.id).map(p => p.category).join() === '您好,谢谢,不客气,再见')`), true);
  assert.equal(s.run(`REGIONAL_PHRASES.every(p => ['text','meaning','ipa','katakana','romanization','scenario','knowledge','ttsLang','lang','dir'].every(k => typeof p[k] === 'string' && p[k].length) && !('derived' in p) && p.audioFile === null)`), true);
});

test('every main phrase still renders; hidden languages and RTL remain supported', () => {
  const s = setup();
  assert.equal(s.run('phrases.every(p => { renderCard(p); return original.textContent === p.text; })'), true);
  assert.equal(s.run('LANGUAGES.filter(l => !isLangVisible(l)).map(l => l.id).join()'), 'yue,th');
  s.run('showMoreLangs = true; populateLangSelect();');
  assert.equal(s.run('LANGUAGES.every(isLangVisible)'), true);
  s.run(`renderCard(phrases.find(p => p.lang === 'he'));`);
  assert.equal(s.els.get('original').dir, 'rtl');
  s.run(`const e = {...REGIONAL_PHRASES[0], lang:'ar-SA', dir:'rtl'}; const c = renderRegionalPhrase(e, REGIONS[0]);`);
  assert.equal(s.run('c.children[0].children[1].dir'), 'rtl');
});

test('main French keeps Thomas order and all existing voice fallback options', () => {
  const voices = [voice('Daniel','fr-FR'), voice('Amélie','fr-CA'), voice('Thomas (Enhanced)','fr-FR'), voice('Thomas','fr-FR')];
  const s = setup({voices});
  for (const name of ['Thomas', 'Amélie', 'Thomas (Enhanced)', 'Daniel']) {
    assert.equal(s.run(`selectVoice('fr-FR').name`), name);
    voices.splice(voices.findIndex(v => v.name === name),1);
  }
  assert.equal(s.run(`selectVoice('fr-FR')`), null);
});

test('regional exact locale wins; fallback preserves French Thomas and Norwegian aliases', () => {
  const voices = [voice('Anna','de-DE'), voice('Thomas','fr-FR'), voice('Amélie','fr-CA'), voice('Swiss','de-CH'), voice('Austrian','de-AT'), voice('Nora','no-NO')];
  const s = setup({voices});
  assert.equal(s.run(`selectRegionalVoice('de-CH',['de-DE']).name`),'Swiss');
  assert.equal(s.run(`selectRegionalVoice('de-AT',['de-DE']).name`),'Austrian');
  assert.equal(s.run(`selectRegionalVoice('fr-CA',['fr-FR']).name`),'Amélie');
  voices.splice(2,1);
  assert.equal(s.run(`selectRegionalVoice('fr-CA',['fr-FR']).name`),'Thomas');
  assert.equal(s.run(`selectRegionalVoice('nb-NO',['no-NO']).name`),'Nora');
  assert.equal(s.run(`selectRegionalVoice('is-IS',[])`),null);
});

test('all 32 entries play through shared engine using supplied voices and reset their button', () => {
  const s=setup({voices:['de-CH','de-AT','fr-CA','nl-NL','sv-SE','nb-NO','da-DK','is-IS'].map(l=>voice(l,l))});
  s.run(`for (const entry of REGIONAL_PHRASES) {
    const button = document.createElement('button'), warning = document.createElement('p');
    playEntry(entry,button,warning,entry.region);
    activePlayback.utterance.onstart();
    if (!button.classList.contains('speaking')) throw Error('not speaking');
    activePlayback.utterance.onend();
    if (button.classList.contains('speaking') || button.attrs['aria-busy'] !== 'false') throw Error('stuck button');
  }`);
  assert.equal(s.utterances.length,32);
  assert.equal(s.utterances.every(u=>u.lang===u.voice.lang && u.rate===0.85),true);
});

test('missing voice or unavailable Web Speech displays warning without wrong-language speech', () => {
  for(const speech of [true,false]) {
    const s=setup({voices:[voice('English','en-US')],speech});
    s.run(`playEntry(REGIONAL_PHRASES[31], speakBtn, voiceWarning, '冰岛');`);
    assert.equal(s.utterances.length,0);
    assert.equal(s.run('voiceWarning.hidden'),false);
    assert.match(s.run('voiceWarning.textContent'),/冰岛/);
    assert.equal(s.run(`speakBtn.classList.contains('speaking')`),false);
  }
});

test('audio file takes priority; both failure signals cause only one TTS fallback', async () => {
  const s=setup({voices:[voice('Thomas','fr-FR')]});
  s.run(`playEntry({...phrases.find(p=>p.lang==='fr'),audioFile:'/sample.mp3'},speakBtn,voiceWarning,'fr');`);
  assert.equal(s.audio.length,1); assert.equal(s.utterances.length,0);
  assert.equal(s.audio[0].playbackRate,0.85);
  s.audio[0].onerror(); s.audio[0].reject(new Error('failed'));
  await Promise.resolve();
  assert.equal(s.utterances.length,1);
  assert.equal(s.utterances[0].voice.name,'Thomas');
});

test('late audio rejection and canceled utterance cannot change a newer playback', async () => {
  const s=setup({voices:[voice('Thomas','fr-FR')]});
  s.run(`playEntry({...phrases.find(p=>p.lang==='fr'),audioFile:'/old.mp3'},speakBtn,voiceWarning,'fr');`);
  s.run(`playEntry(phrases.find(p=>p.lang==='fr'),speakBtn,voiceWarning,'fr');`);
  s.utterances[0].onstart();
  s.audio[0].reject(new Error('late failure')); await Promise.resolve();
  assert.equal(s.utterances.length,1);
  s.run(`playEntry(phrases.find(p=>p.lang==='fr'),speakBtn,voiceWarning,'fr');`);
  s.utterances[1].onstart(); s.utterances[0].onend();
  assert.equal(s.run(`speakBtn.classList.contains('speaking')`),true);
  s.run(`window.location.hash='#regional/ch-de';renderRoute();`);
  assert.equal(s.run(`speakBtn.classList.contains('speaking')`),false);
  assert.equal(s.els.get('regionalPhrases').children.length,4);
  assert.equal(s.els.get('mainView').hidden,true);
});

test('speech failure clears button and shows a retry warning', () => {
  const s=setup({voices:[voice('Thomas','fr-FR')]});
  s.run(`playEntry(phrases.find(p=>p.lang==='fr'),speakBtn,voiceWarning,'fr');`);
  s.utterances[0].onstart();s.utterances[0].onerror({error:'synthesis-failed'});
  assert.equal(s.run(`speakBtn.classList.contains('speaking')`),false);
  assert.match(s.run('voiceWarning.textContent'),/重试/);
});

test('PWA precaches every script including versioned app; serves every asset offline', async () => {
  const events={}, stored=new Map();
  const cache={addAll:async urls=> {for(const url of urls){
    const file=url==='/'?'index.html':url.slice(1).split('?')[0];
    assert.equal(fs.existsSync(path.join(root,file)),true,`missing ${url}`);
    stored.set(url,{url,status:200});
  }},put:async()=>{}};
  const context=vm.createContext({self:{addEventListener:(e,fn)=>events[e]=fn,skipWaiting(){},clients:{claim(){}}},
    caches:{open:async()=>cache,match:async request=>stored.get(request.url),keys:async()=>[],delete:async()=>true},
    fetch:async()=>{throw new Error('offline');},Promise});
  vm.runInContext(fs.readFileSync(path.join(root,'sw.js'),'utf8'),context);
  let installed;events.install({waitUntil:p=>installed=p});await installed;
  const scripts=[...fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>'/'+m[1]);
  for(const url of scripts) assert.equal(stored.has(url),true,url);
  for(const url of stored.keys()){
    let response;events.fetch({request:{method:'GET',url},respondWith:p=>response=p});
    assert.equal((await response).status,200,url);
  }
});
