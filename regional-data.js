/*
 * 地区问候：独立于 data.js 的 phrases，不参与主语言下拉框。
 * 参见 REGIONAL_NOTES.md 的选词来源、音标范围与人工验收说明。
 * 扩展：向 REGIONS 加地区元数据，再向 REGIONAL_PHRASES 加四条。
 * lang 是内容语言（可为 gsw-CH），ttsLang 是合成语音 locale（如 de-CH）。
 * ttsFallbacks 仅列可接受的同语言区域／别名，绝不跨语言代读。
 * 可选 audioFile 为母语录音路径，优先于 TTS；dir 可设 rtl。
 * 所有原文均用拉丁字母，romanization 保留原拼写，非英语式注音。
 * IPA 是代表性宽式读音，省略部分语调、细微连读；片假名仅近似。
 */
const REGIONS = [
  {
    "id": "ch-de",
    "flag": "🇨🇭",
    "name": "瑞士德语区",
    "localName": "Schweizerdeutsch",
    "lang": "gsw-CH",
    "ttsLang": "de-CH",
    "ttsFallbacks": [
      "de-DE"
    ],
    "note": "这里以苏黎世一带常见问候为参考。瑞士德语是一组方言，伯尔尼等地区的说法和读音会不同；不必模仿完整口音。",
    "ttsNote": "发音使用系统德语语音：优先 de-CH，再回退标准德语。de-CH 通常也是瑞士标准德语，不能替代瑞士德语方言示范。"
  },
  {
    "id": "at-de",
    "flag": "🇦🇹",
    "name": "奥地利德语",
    "localName": "Österreichisches Deutsch",
    "lang": "de-AT",
    "ttsLang": "de-AT",
    "ttsFallbacks": [
      "de-DE"
    ],
    "note": "采用适合初次接待客人的礼貌说法。谢谢、不客气和再见也通用于其他德语地区，不为突出特色而编造方言。",
    "ttsNote": "发音优先奥地利德语；没有对应语音时使用其他德语语音，口音可能不同。"
  },
  {
    "id": "ca-fr",
    "flag": "🇨🇦",
    "name": "加拿大法语区",
    "localName": "Français canadien",
    "lang": "fr-CA",
    "ttsLang": "fr-CA",
    "ttsFallbacks": [
      "fr-FR"
    ],
    "note": "以魁北克常见的中性礼貌法语为参考，也适合其他加拿大法语客人。四句与通用法语相同，无须刻意模仿地方口音。",
    "ttsNote": "优先加拿大法语语音；缺少时回退法国法语，并沿用 Thomas 优先规则。IPA 采用中性宽式读音。"
  },
  {
    "id": "nl",
    "flag": "🇳🇱",
    "name": "荷兰",
    "localName": "Nederlands",
    "lang": "nl-NL",
    "ttsLang": "nl-NL",
    "ttsFallbacks": [
      "nl-BE"
    ],
    "note": "采用荷兰通用表达。初次接待客人用 u 表达礼貌；不需要刻意使用俚语。",
    "ttsNote": "优先荷兰荷兰语；缺少时可使用比利时荷兰语，口音会不同。"
  },
  {
    "id": "sv",
    "flag": "🇸🇪",
    "name": "瑞典",
    "localName": "Svenska",
    "lang": "sv-SE",
    "ttsLang": "sv-SE",
    "ttsFallbacks": [],
    "note": "简短的 Hej 配合友善语气，也适合接待陌生客人。这里采用通用瑞典语，读音以瑞典中部为参考。",
    "ttsNote": "使用系统瑞典语语音。片假名无法准确表示瑞典语元音与语调。"
  },
  {
    "id": "no",
    "flag": "🇳🇴",
    "name": "挪威",
    "localName": "Norsk · bokmål",
    "lang": "nb-NO",
    "ttsLang": "nb-NO",
    "ttsFallbacks": [
      "no-NO"
    ],
    "note": "拼写采用书面挪威语 bokmål，读音以挪威东部为参考。挪威方言很多，客人的实际口音可能不同。",
    "ttsNote": "优先 nb-NO，也兼容系统标为 no-NO 的挪威语 voice。不会借用瑞典语或丹麦语朗读。"
  },
  {
    "id": "da",
    "flag": "🇩🇰",
    "name": "丹麦",
    "localName": "Dansk",
    "lang": "da-DK",
    "ttsLang": "da-DK",
    "ttsFallbacks": [],
    "note": "采用通用丹麦语。Hej 和 Hej hej 在日常服务中也很自然；礼貌主要来自语气和态度。",
    "ttsNote": "使用系统丹麦语语音。软 d、弱读和喉塞等细节无法用片假名完整表示。"
  },
  {
    "id": "is",
    "flag": "🇮🇸",
    "name": "冰岛",
    "localName": "Íslenska",
    "lang": "is-IS",
    "ttsLang": "is-IS",
    "ttsFallbacks": [],
    "note": "采用通用冰岛语。白天可用 Góðan daginn 礼貌问候，晚上可换成 Halló；不需要模仿复杂方言。",
    "ttsNote": "仅使用冰岛语 voice；未安装时会提示。不会用英语或其他北欧语言代读。"
  }
];

const REGIONAL_PHRASES = [
  {
    "id": "ch-de-1",
    "region": "ch-de",
    "category": "您好",
    "text": "Grüezi",
    "meaning": "您好（礼貌问候）",
    "ipa": "/ˈɡryətsi/",
    "katakana": "グリュエツィ",
    "romanization": "Grüezi",
    "audioFile": null,
    "scenario": "白天在前台迎接一位客人时使用。",
    "knowledge": "常见于苏黎世及瑞士东部；伯尔尼等地也常说 Grüessech。多人可说 Grüezi mitenand。",
    "ttsLang": "de-CH",
    "ttsFallbacks": [
      "de-DE"
    ],
    "lang": "gsw-CH",
    "dir": "ltr"
  },
  {
    "id": "ch-de-2",
    "region": "ch-de",
    "category": "谢谢",
    "text": "Merci",
    "meaning": "谢谢",
    "ipa": "/ˈmɛrsi/",
    "katakana": "メルスィ",
    "romanization": "Merci",
    "audioFile": null,
    "scenario": "客人递交资料或配合服务后，微笑致谢。",
    "knowledge": "借自法语，在瑞士德语日常交流中很常见；重音和元音会因地区而异。Danke 也能自然使用。",
    "ttsLang": "de-CH",
    "ttsFallbacks": [
      "de-DE"
    ],
    "lang": "gsw-CH",
    "dir": "ltr"
  },
  {
    "id": "ch-de-3",
    "region": "ch-de",
    "category": "不客气",
    "text": "Bitte",
    "meaning": "不客气",
    "ipa": "/ˈbɪtə/",
    "katakana": "ビテ",
    "romanization": "Bitte",
    "audioFile": null,
    "scenario": "客人说谢谢后，用简短礼貌的回应。",
    "knowledge": "这里选用也适用于瑞士的通用德语形式，不标成瑞士独有方言；它还可表示“请／给您”，要结合场景。",
    "ttsLang": "de-CH",
    "ttsFallbacks": [
      "de-DE"
    ],
    "lang": "gsw-CH",
    "dir": "ltr"
  },
  {
    "id": "ch-de-4",
    "region": "ch-de",
    "category": "再见",
    "text": "Uf Wiederluege",
    "meaning": "再见（礼貌告别）",
    "ipa": "/ʊf ˈʋiːdərˌluəɡə/",
    "katakana": "ウフ ヴィーダールエゲ",
    "romanization": "Uf Wiederluege",
    "audioFile": null,
    "scenario": "客人离开前台或退房后告别。",
    "knowledge": "瑞士德语常见礼貌告别，近似标准德语 Auf Wiedersehen；拼写和读音存在地区差异。",
    "ttsLang": "de-CH",
    "ttsFallbacks": [
      "de-DE"
    ],
    "lang": "gsw-CH",
    "dir": "ltr"
  },
  {
    "id": "at-de-1",
    "region": "at-de",
    "category": "您好",
    "text": "Grüß Gott",
    "meaning": "您好（礼貌问候）",
    "ipa": "/ɡryːs ˈɡɔt/",
    "katakana": "グリュース ゴット",
    "romanization": "Grüß Gott",
    "audioFile": null,
    "scenario": "首次迎接奥地利客人时使用。",
    "knowledge": "奥地利常见礼貌问候，也见于德国南部；虽含 Gott，日常使用通常就是打招呼。Servus 更偏熟悉、随和。",
    "ttsLang": "de-AT",
    "ttsFallbacks": [
      "de-DE"
    ],
    "lang": "de-AT",
    "dir": "ltr"
  },
  {
    "id": "at-de-2",
    "region": "at-de",
    "category": "谢谢",
    "text": "Danke schön",
    "meaning": "非常感谢",
    "ipa": "/ˈdaŋkə ʃøːn/",
    "katakana": "ダンケ シェーン",
    "romanization": "Danke schön",
    "audioFile": null,
    "scenario": "客人配合手续或给予帮助后致谢。",
    "knowledge": "这是奥地利也自然使用的通用德语表达，并非奥地利独有。",
    "ttsLang": "de-AT",
    "ttsFallbacks": [
      "de-DE"
    ],
    "lang": "de-AT",
    "dir": "ltr"
  },
  {
    "id": "at-de-3",
    "region": "at-de",
    "category": "不客气",
    "text": "Bitte",
    "meaning": "不客气",
    "ipa": "/ˈbɪtə/",
    "katakana": "ビテ",
    "romanization": "Bitte",
    "audioFile": null,
    "scenario": "回应客人的感谢。",
    "knowledge": "简单而礼貌，通用于德语地区；说完后稍停即可，不需要加上方言词。",
    "ttsLang": "de-AT",
    "ttsFallbacks": [
      "de-DE"
    ],
    "lang": "de-AT",
    "dir": "ltr"
  },
  {
    "id": "at-de-4",
    "region": "at-de",
    "category": "再见",
    "text": "Auf Wiedersehen",
    "meaning": "再见",
    "ipa": "/aʊf ˈviːdɐˌzeːən/",
    "katakana": "アウフ ヴィーダーゼーエン",
    "romanization": "Auf Wiedersehen",
    "audioFile": null,
    "scenario": "客人离开前台或退房时礼貌告别。",
    "knowledge": "采用通用礼貌形式；奥地利也能听到 Wiederschauen。无需为了地方感而使用较亲昵的告别。",
    "ttsLang": "de-AT",
    "ttsFallbacks": [
      "de-DE"
    ],
    "lang": "de-AT",
    "dir": "ltr"
  },
  {
    "id": "ca-fr-1",
    "region": "ca-fr",
    "category": "您好",
    "text": "Bonjour",
    "meaning": "您好／日安",
    "ipa": "/bɔ̃.ʒuʁ/",
    "katakana": "ボンジュール",
    "romanization": "Bonjour",
    "audioFile": null,
    "scenario": "白天迎接加拿大法语客人时使用。",
    "knowledge": "加拿大法语区也自然使用 Bonjour；晚间迎接可用 Bonsoir。鼻元音不能完全用“ボン”表达。",
    "ttsLang": "fr-CA",
    "ttsFallbacks": [
      "fr-FR"
    ],
    "lang": "fr-CA",
    "dir": "ltr"
  },
  {
    "id": "ca-fr-2",
    "region": "ca-fr",
    "category": "谢谢",
    "text": "Merci",
    "meaning": "谢谢",
    "ipa": "/mɛʁ.si/",
    "katakana": "メルスィ",
    "romanization": "Merci",
    "audioFile": null,
    "scenario": "客人递交证件或配合手续后致谢。",
    "knowledge": "与其他法语地区写法相同；加拿大内部也有多种口音，不必刻意模仿。",
    "ttsLang": "fr-CA",
    "ttsFallbacks": [
      "fr-FR"
    ],
    "lang": "fr-CA",
    "dir": "ltr"
  },
  {
    "id": "ca-fr-3",
    "region": "ca-fr",
    "category": "不客气",
    "text": "Je vous en prie",
    "meaning": "您不必客气",
    "ipa": "/ʒə vu.zɑ̃ pʁi/",
    "katakana": "ジュ ヴザン プリ",
    "romanization": "Je vous en prie",
    "audioFile": null,
    "scenario": "回应客人的感谢，适合前台等礼貌服务场景。",
    "knowledge": "使用礼貌的 vous。当地口语中也会听到 Bienvenue 回应感谢，但魁北克语言规范建议正式服务采用 Je vous en prie 等表达。",
    "ttsLang": "fr-CA",
    "ttsFallbacks": [
      "fr-FR"
    ],
    "lang": "fr-CA",
    "dir": "ltr"
  },
  {
    "id": "ca-fr-4",
    "region": "ca-fr",
    "category": "再见",
    "text": "Au revoir",
    "meaning": "再见",
    "ipa": "/o ʁə.vwaʁ/",
    "katakana": "オ ルヴワール",
    "romanization": "Au revoir",
    "audioFile": null,
    "scenario": "客人结束咨询或离开时告别。",
    "knowledge": "通用且礼貌，不是加拿大独有表达；比对陌生客人说 Salut 更稳妥。",
    "ttsLang": "fr-CA",
    "ttsFallbacks": [
      "fr-FR"
    ],
    "lang": "fr-CA",
    "dir": "ltr"
  },
  {
    "id": "nl-1",
    "region": "nl",
    "category": "您好",
    "text": "Hallo",
    "meaning": "您好／你好",
    "ipa": "/ɦɑˈloː/",
    "katakana": "ハロー",
    "romanization": "Hallo",
    "audioFile": null,
    "scenario": "全天都可用来友善迎接客人。",
    "knowledge": "荷兰语的普通问候，在酒店也自然；不用把它刻意说成英语 hello。",
    "ttsLang": "nl-NL",
    "ttsFallbacks": [
      "nl-BE"
    ],
    "lang": "nl-NL",
    "dir": "ltr"
  },
  {
    "id": "nl-2",
    "region": "nl",
    "category": "谢谢",
    "text": "Dank u wel",
    "meaning": "谢谢您",
    "ipa": "/ˌdɑŋk y ˈʋɛl/",
    "katakana": "ダンク ユ ヴェル",
    "romanization": "Dank u wel",
    "audioFile": null,
    "scenario": "客人提供资料或耐心等候后致谢。",
    "knowledge": "u 是礼貌称呼；熟悉之后也会听到 Dank je wel。u 的圆唇元音不等于日语 ユ。",
    "ttsLang": "nl-NL",
    "ttsFallbacks": [
      "nl-BE"
    ],
    "lang": "nl-NL",
    "dir": "ltr"
  },
  {
    "id": "nl-3",
    "region": "nl",
    "category": "不客气",
    "text": "Graag gedaan",
    "meaning": "不客气／乐意效劳",
    "ipa": "/ˌɣraːx xəˈdaːn/",
    "katakana": "フラーフ ヘダーン",
    "romanization": "Graag gedaan",
    "audioFile": null,
    "scenario": "客人感谢帮助后回应。",
    "knowledge": "g／ch 的摩擦音因地区而异，不是日语的ガ行；不要为了接近发音而过度用力。",
    "ttsLang": "nl-NL",
    "ttsFallbacks": [
      "nl-BE"
    ],
    "lang": "nl-NL",
    "dir": "ltr"
  },
  {
    "id": "nl-4",
    "region": "nl",
    "category": "再见",
    "text": "Tot ziens",
    "meaning": "再见",
    "ipa": "/tɔt ˈzins/",
    "katakana": "トット ズィーンス",
    "romanization": "Tot ziens",
    "audioFile": null,
    "scenario": "服务结束、客人离开时礼貌告别。",
    "knowledge": "通用且适合陌生客人；字面接近“下次见”。",
    "ttsLang": "nl-NL",
    "ttsFallbacks": [
      "nl-BE"
    ],
    "lang": "nl-NL",
    "dir": "ltr"
  },
  {
    "id": "sv-1",
    "region": "sv",
    "category": "您好",
    "text": "Hej",
    "meaning": "您好／你好",
    "ipa": "/hɛj/",
    "katakana": "ヘイ",
    "romanization": "Hej",
    "audioFile": null,
    "scenario": "微笑迎接客人，全天可用。",
    "knowledge": "简短不代表失礼；在一般服务场景中，对陌生客人也可以使用。",
    "ttsLang": "sv-SE",
    "ttsFallbacks": [],
    "lang": "sv-SE",
    "dir": "ltr"
  },
  {
    "id": "sv-2",
    "region": "sv",
    "category": "谢谢",
    "text": "Tack",
    "meaning": "谢谢",
    "ipa": "/takː/",
    "katakana": "タック",
    "romanization": "Tack",
    "audioFile": null,
    "scenario": "客人配合手续后致谢。",
    "knowledge": "末尾 k 要收住；若想加强感谢可说 Tack så mycket，但这里先掌握短句即可。",
    "ttsLang": "sv-SE",
    "ttsFallbacks": [],
    "lang": "sv-SE",
    "dir": "ltr"
  },
  {
    "id": "sv-3",
    "region": "sv",
    "category": "不客气",
    "text": "Varsågod",
    "meaning": "不客气",
    "ipa": "/vɑːʂɔˈɡuː/",
    "katakana": "ヴァーショグー",
    "romanization": "Varsågod",
    "audioFile": null,
    "scenario": "回应感谢时使用。",
    "knowledge": "也可在递出物品时表示“给您／请用”；瑞典中部常把 r+s 连成类似 sh 的音，结尾 d 常弱化或不读。",
    "ttsLang": "sv-SE",
    "ttsFallbacks": [],
    "lang": "sv-SE",
    "dir": "ltr"
  },
  {
    "id": "sv-4",
    "region": "sv",
    "category": "再见",
    "text": "Hej då",
    "meaning": "再见",
    "ipa": "/hɛj ˈdoː/",
    "katakana": "ヘイ ドー",
    "romanization": "Hej då",
    "audioFile": null,
    "scenario": "客人离开时友善告别。",
    "knowledge": "Hej 是问候，加上 då 就成了告别；å 接近长 o 音。",
    "ttsLang": "sv-SE",
    "ttsFallbacks": [],
    "lang": "sv-SE",
    "dir": "ltr"
  },
  {
    "id": "no-1",
    "region": "no",
    "category": "您好",
    "text": "Hei",
    "meaning": "您好／你好",
    "ipa": "/hæɪ/",
    "katakana": "ハイ",
    "romanization": "Hei",
    "audioFile": null,
    "scenario": "迎接客人时友善地打招呼。",
    "knowledge": "日常服务中常用，适合陌生客人；这里参考东部读音，不代表全国唯一口音。",
    "ttsLang": "nb-NO",
    "ttsFallbacks": [
      "no-NO"
    ],
    "lang": "nb-NO",
    "dir": "ltr"
  },
  {
    "id": "no-2",
    "region": "no",
    "category": "谢谢",
    "text": "Takk",
    "meaning": "谢谢",
    "ipa": "/tɑkː/",
    "katakana": "タック",
    "romanization": "Takk",
    "audioFile": null,
    "scenario": "客人配合或提供信息后致谢。",
    "knowledge": "双写 kk 表示短元音后的长辅音；不要拖长成“ターク”。",
    "ttsLang": "nb-NO",
    "ttsFallbacks": [
      "no-NO"
    ],
    "lang": "nb-NO",
    "dir": "ltr"
  },
  {
    "id": "no-3",
    "region": "no",
    "category": "不客气",
    "text": "Bare hyggelig",
    "meaning": "不客气／很乐意",
    "ipa": "/ˈbɑːrə ˈhʏɡːəli/",
    "katakana": "バーレ ヒュッゲリ",
    "romanization": "Bare hyggelig",
    "audioFile": null,
    "scenario": "客人感谢服务后回应。",
    "knowledge": "自然的感谢应答；hyggelig 的 g 结尾不单独发音，y 是前圆唇元音。",
    "ttsLang": "nb-NO",
    "ttsFallbacks": [
      "no-NO"
    ],
    "lang": "nb-NO",
    "dir": "ltr"
  },
  {
    "id": "no-4",
    "region": "no",
    "category": "再见",
    "text": "Ha det bra",
    "meaning": "再见／祝您顺心",
    "ipa": "/hɑː də ˈbrɑː/",
    "katakana": "ハー デ ブラー",
    "romanization": "Ha det bra",
    "audioFile": null,
    "scenario": "客人离开时友善告别。",
    "knowledge": "常见完整告别，也可听到简短的 Ha det；det 在连读中通常弱读。",
    "ttsLang": "nb-NO",
    "ttsFallbacks": [
      "no-NO"
    ],
    "lang": "nb-NO",
    "dir": "ltr"
  },
  {
    "id": "da-1",
    "region": "da",
    "category": "您好",
    "text": "Hej",
    "meaning": "您好／你好",
    "ipa": "/hɑj/",
    "katakana": "ハイ",
    "romanization": "Hej",
    "audioFile": null,
    "scenario": "迎接客人时使用，全天都自然。",
    "knowledge": "在日常酒店服务中也能使用；语气友好即可，不必寻找更夸张的地方说法。",
    "ttsLang": "da-DK",
    "ttsFallbacks": [],
    "lang": "da-DK",
    "dir": "ltr"
  },
  {
    "id": "da-2",
    "region": "da",
    "category": "谢谢",
    "text": "Tak",
    "meaning": "谢谢",
    "ipa": "/tɑɡ/",
    "katakana": "タック",
    "romanization": "Tak",
    "audioFile": null,
    "scenario": "客人递交资料或配合服务后致谢。",
    "knowledge": "结尾为不送气的塞音；片假名无法精确表达，不要读成英语 take。",
    "ttsLang": "da-DK",
    "ttsFallbacks": [],
    "lang": "da-DK",
    "dir": "ltr"
  },
  {
    "id": "da-3",
    "region": "da",
    "category": "不客气",
    "text": "Det var så lidt",
    "meaning": "不客气／小事一桩",
    "ipa": "/de vɑ sʌ ˈlið/",
    "katakana": "デ ヴァ ソ リズ",
    "romanization": "Det var så lidt",
    "audioFile": null,
    "scenario": "客人说 Tak 后，礼貌回应。",
    "knowledge": "常见感谢应答。Selv tak 更含“也谢谢您”的回谢意味；本句适合一般帮助后的回应。软 d 不是日语 ズ。",
    "ttsLang": "da-DK",
    "ttsFallbacks": [],
    "lang": "da-DK",
    "dir": "ltr"
  },
  {
    "id": "da-4",
    "region": "da",
    "category": "再见",
    "text": "Hej hej",
    "meaning": "再见",
    "ipa": "/hɑj ˈhɑj/",
    "katakana": "ハイ ハイ",
    "romanization": "Hej hej",
    "audioFile": null,
    "scenario": "客人离开时友善告别。",
    "knowledge": "重复的 Hej hej 常用作告别；单说 Hej 通常是问候，需结合交谈情境。",
    "ttsLang": "da-DK",
    "ttsFallbacks": [],
    "lang": "da-DK",
    "dir": "ltr"
  },
  {
    "id": "is-1",
    "region": "is",
    "category": "您好",
    "text": "Góðan daginn",
    "meaning": "您好／日安",
    "ipa": "/ˈkouːðan ˈtaijɪn/",
    "katakana": "ゴーザン ダイイン",
    "romanization": "Góðan daginn",
    "audioFile": null,
    "scenario": "白天在前台礼貌迎接客人。",
    "knowledge": "晚间可改说 Halló。ð 类似英语 that 中的 th；原文 g、d 在这里是清音，片假名只能近似。",
    "ttsLang": "is-IS",
    "ttsFallbacks": [],
    "lang": "is-IS",
    "dir": "ltr"
  },
  {
    "id": "is-2",
    "region": "is",
    "category": "谢谢",
    "text": "Takk fyrir",
    "meaning": "谢谢您",
    "ipa": "/ˈtʰahk ˈfɪːrɪr/",
    "katakana": "タック フィーリル",
    "romanization": "Takk fyrir",
    "audioFile": null,
    "scenario": "客人配合手续或提供帮助后致谢。",
    "knowledge": "常见感谢短语，不依赖客人性别；也常简说 Takk。kk 前有预送气，不能完全用“ック”表示。",
    "ttsLang": "is-IS",
    "ttsFallbacks": [],
    "lang": "is-IS",
    "dir": "ltr"
  },
  {
    "id": "is-3",
    "region": "is",
    "category": "不客气",
    "text": "Ekkert að þakka",
    "meaning": "不客气／不必谢",
    "ipa": "/ˈɛhcɛr̥t að ˈθahka/",
    "katakana": "エッキェルト アズ サッカ",
    "romanization": "Ekkert að þakka",
    "audioFile": null,
    "scenario": "回应客人的感谢。",
    "knowledge": "字面接近“没有什么需要感谢的”。þ 类似英语 think 中的 th，不是 s；片假名仅辅助记忆。",
    "ttsLang": "is-IS",
    "ttsFallbacks": [],
    "lang": "is-IS",
    "dir": "ltr"
  },
  {
    "id": "is-4",
    "region": "is",
    "category": "再见",
    "text": "Bless",
    "meaning": "再见",
    "ipa": "/plɛsː/",
    "katakana": "ブレス",
    "romanization": "Bless",
    "audioFile": null,
    "scenario": "客人离开时自然告别。",
    "knowledge": "常见日常告别，也常重复为 Bless bless；这里不是英语 bless 的祝福用法。",
    "ttsLang": "is-IS",
    "ttsFallbacks": [],
    "lang": "is-IS",
    "dir": "ltr"
  }
];
