# 服务用语学习

多语言服务场合礼貌表达学习工具（纯静态 PWA）。

## 本地预览

```bash
cd ~/Projects/service-phrases-learn
python3 -m http.server 8080
```

浏览器访问 http://localhost:8080（PWA 需 http/https，不能直接 file:// 打开）

## 部署

推荐使用 Vercel + GitHub，详见项目说明或 Vercel 文档。

## 地区特色问候

首页“地区特色问候”进入独立列表；每个地区直接展示您好、谢谢、不客气、再见。
主词库保持在 data.js，地区元数据和 32 条表达位于 regional-data.js。
来源、发音范围、扩展字段和验收限制见 [REGIONAL_NOTES.md](REGIONAL_NOTES.md)。

零依赖回归检查：

```bash
node --test tests/regional-smoke.test.cjs
```
