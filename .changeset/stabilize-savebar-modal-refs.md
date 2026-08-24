---
'@shopify/app-bridge-react': patch
---

Stabilize SaveBar and Modal ref callbacks so React 18 does not detach/attach (and setState) on every render.

Fixes #565
