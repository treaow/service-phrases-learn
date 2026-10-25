# 地区特色问候：内容与验收说明

本模块独立于主词库。`REGIONS` 与全部 32 条 `REGIONAL_PHRASES` 位于 `regional-data.js`。
每条含稳定 id、region、category、text、meaning、ipa、katakana、romanization、audioFile、scenario、knowledge、lang、dir、ttsLang、ttsFallbacks。没有 derived。
新增地区时在 REGIONS 添加元数据，再按“您好、谢谢、不客气、再见”顺序添加四条。`audioFile` 可在获得真实录音后填写；当前 32 条均为 null。

## 选词与来源

查阅日期：2026-10-25。来源用于核对表达及使用场景；IPA 和片假名是本次编写的辅助标注，不声称由来源逐条提供，也未经过母语者审校。

- 瑞士德语区：Grüezi / Merci / Bitte / Uf Wiederluege。以苏黎世一带为参考，说明伯尔尼等地存在差异；Bitte 明确采用通用德语形式。参考[卢塞恩州礼貌用语说明](https://gruezi.lu.ch/gut_zu_wissen/so_tickt_die_schweiz)、[瑞士语言与常用表达](https://myzurich.org/practical/languages/)、[瑞士媒体对礼貌告别的说明](https://www.beobachter.ch/familie-freunde/erziehung/etwas-mehr-respekt-bitte-10084)。
- 奥地利德语：Grüß Gott / Danke schön / Bitte / Auf Wiedersehen。除问候外采用通用礼貌德语，没有杜撰地方形式。参考[奥地利官方人才服务的礼仪说明](https://www.workinaustria.com/fachkraefte/your-personal-guide/oesterreich-kennenlernen/oesterreichische-umgangsformen)、[维也纳大学地方用语指南](https://pundp2018.univie.ac.at/kleiner-wiener-sprachfuehrer/)。
- 加拿大法语：Bonjour / Merci / Je vous en prie / Au revoir。采用适用于酒店的中性礼貌法语；说明口语 Bienvenue 的应答用法与正式服务规范的区别。参考[魁北克法语办公室：回复感谢](https://vitrinelinguistique.oqlf.gouv.qc.ca/23265/la-redaction-et-la-communication/communications-telephoniques/conclure-un-appel)。
- 荷兰：Hallo / Dank u wel / Graag gedaan / Tot ziens。参考[莱顿大学新生用语资料](https://www.universiteitleiden.nl/binaries/content/assets/governance-and-global-affairs/luc/getting-started/introweek-issue2020s.pdf)、[瓦赫宁根大学用语指南](https://www.wur.nl/upload_mm/0/9/0/44f0db07-7c8a-469f-a194-f0f16897f8c1_Your%20Guide%202015-2016.pdf)。
- 瑞典：Hej / Tack / Varsågod / Hej då。参考[瑞典旅游局](https://traveltrade.visitsweden.com/why-sweden/)、[瑞典语语言咨询对 Varsågod 的说明](https://sprakbruk.fi/artiklar/varsag-1/)。
- 挪威：Hei / Takk / Bare hyggelig / Ha det bra。拼写采用 bokmål，读音参考东部。参考[挪威科技大学 NoW 词表](https://www.ntnu.edu/now/vocabulary/list)。
- 丹麦：Hej / Tak / Det var så lidt / Hej hej。使用普遍适用的感谢应答，区分 Selv tak 所含的回谢意味。参考[丹麦语词典：Det var så lidt](https://www.ordnet.dk/ddo/ordbog/59005832?def_id=21047524)、[Selv tak](https://www.ordnet.dk/ddo/ordbog/59010738?def_id=21084376)、[Tak 发音](https://ordnet.dk/ddo/ordbog/tak)、[日常问候说明](https://www.wisevisitor.com/danish/)。
- 冰岛：Góðan daginn / Takk fyrir / Ekkert að þakka / Bless。说明白天问候的时间限制。参考[冰岛旅游资料](https://guidetoiceland.is/history-culture/icelandic-phrases)、[冰岛旅行常用语](https://www.turismoislandia.com/en/practical-info/idioma-frases)、[冰岛本地旅行内容的感谢应答说明](https://www.stuckiniceland.com/phrases-in-icelandic/)。

## 发音与人工确认

- 目标是友善地说一句当地话，不是模仿母语者身份。IPA 为代表性宽式标注，不包含所有音调和连读细节；片假名无法精确表示前圆唇元音、鼻元音、软 d、预送气等。
- 所有原文已经使用拉丁字母，romanization 保留原拼写，含变音符号；它不是另造的英语式拼读法。
- 优先请瑞士德语使用者确认 Grüezi、Merci、Uf Wiederluege 的参考读音及片假名；请丹麦语和冰岛语使用者确认各句连读、软 d、预送气与片假名的可用性。其他地区也建议在正式作为培训材料前做一次母语者审听。
- 瑞士 `de-CH` 系统语音通常是瑞士标准德语，不是 `gsw-CH` 方言。当前系统实际回退至 Anna / de-DE，尤其不能把 Uf Wiederluege 的合成读音当成母语方言示范。页面已明确说明，后续可通过 audioFile 接入真实录音。

## 播放器与本地验证

主词库和地区卡片都调用 `playEntry`，保持录音优先、失败回退 TTS、0.85 倍速、voiceWarning 和播放中状态。主词库的 selectVoice 与法语 Thomas 优先顺序保持原样。
地区先精确匹配 ttsLang，再匹配显式 ttsFallbacks，最后仅回退到同语言的其他地区语音。加拿大优先 fr-CA；回退 fr-FR 时沿用 Thomas 优先。挪威兼容 nb-NO / no-NO。冰岛没有可用 voice 时提示，不跨语言代读。
切换词条、页面或应用转入后台会停止播放；旧录音或旧 utterance 的延迟回调不会覆盖新按钮状态。

2026-10-25 本地浏览器验证：

- 独立入口、8 个地区、32 张表达卡片均正常；每个详情页直接显示四句，无需逐句展开。
- 主词库法语 Bonjour 实际收到 Thomas / fr-FR 的 onstart、onend；语言展开/收起、隐藏语言选择清除、主词库选择在页面返回后保留均正常。
- 28 条具备系统 voice 的地区表达均逐个点击，收到 onstart 和 onend，播放状态复原。瑞士及奥地利为 Anna / de-DE；加拿大为 Amélie / fr-CA；荷兰 Xander / nl-NL；瑞典 Alva / sv-SE；挪威 Nora / nb-NO；丹麦 Sara / da-DK。
- 当前系统缺少 is-IS，冰岛 4 个按钮均显示缺少语音提示。冰岛实际合成音未能验收；提供冰岛语 voice 的分支通过自动模拟测试。
- 控制台没有 error；只有预期的 4 条冰岛语音缺失 warning。
- 10 项零依赖回归测试通过：数据完整性、主词库全部词条渲染、语言可见性、主词库及地区 RTL、Thomas 顺序、精确 locale、同语言回退、挪威别名、32 条共用播放器、语音缺失、录音失败回退、旧回调隔离、合成失败提示、PWA 缓存资源和模拟离线读取。
- Service Worker 缓存版本更新并预缓存 regional-data.js 与 HTML 所引用的带版本 app.js，避免离线时缺脚本。离线分支为模拟测试；iPhone 实机安装、离线重启和系统音色仍需用户验收。

运行自动测试（不需要安装依赖）：`node --test tests/regional-smoke.test.cjs`。
未提交、推送或部署。
