# SAASH Agent Connector

Provider-neutral bilingual connector for agents that need Saudi professional capabilities through SAASH Legal Engine and SAASH Workforce Engine.

Public source and releases: https://github.com/SAASH-SA/SAASH-Agent-Connector

## Current GROW access

- Discovery and intent resolution are public, account-free and free of charge.
- Non-effect, non-binding professional invocation is account-free, rate-limited and requires an explicit no-secret/no-personal-data/no-effect acknowledgement.
- Effectful, binding and owner-controlled invocation remains authorization-gated.
- Registration, subscriptions and payment collection are disabled.
- The API key is supplied at runtime only. Never place it in source or connector metadata.

## Discoverable services

- Legal: Najiz (ناجز), Taradhi (تراضي), Moeen (معين), legal knowledge and bounded preparation.
- Workforce: Qiwa (قوى), GOSI (التأمينات الاجتماعية), Mudad (مدد), Ajeer (أجير), Musaned (مساند), and HRSD preparation.

Service availability comes from the live manifest. Preparation or guidance is never represented as completed government execution.

## Use

```js
import { createSaashConnector } from "@saash/agent-connector";

const saash = createSaashConnector({ baseUrl: "https://saash-gateway.vercel.app" });
const match = await saash.select("أحتاج تجهيز تصريح أجير");
```

Before invocation, inspect `match.trust`, `match.safety`, `match.access`, and the declared input schema. Set an API key only for an authorized professional call.

The same contract is available through OpenAPI 3.1.1, MCP discovery, and the A2A Agent Card.
