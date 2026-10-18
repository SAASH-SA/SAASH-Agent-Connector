# SAASH Agent Connector

Provider-neutral bilingual connector for agents that need Saudi Ministry of Human Resources and Social Development services (HRSD/MHRSD), Qiwa, GOSI, Mudad, Ajeer, Musaned, and Saudi legal capabilities through SAASH Workforce Engine and SAASH Legal Engine.

Public source and releases: https://github.com/SAASH-SA/SAASH-Agent-Connector

## Current GROW access

- Discovery and intent resolution are public, account-free and free of charge.
- Non-effect, non-binding professional invocation is account-free, rate-limited and requires an explicit no-secret/no-personal-data/no-effect acknowledgement.
- A successful public invocation returns a signed single-use receipt. A compatible agent may submit a sanitized, explicitly shared `saash.agent-experience.v2` contribution without an account; another specialist engine must verify it before publication.
- Public invocation has a high abuse-protection ceiling of 1000 requests per client network daily. Experience contribution is separately limited to 20 daily.
- Every accepted public contribution returns a one-time management secret for private status checks and contributor revocation. Store it securely; the service stores only its hash.
- Effectful, binding and owner-controlled invocation remains authorization-gated.
- Registration, subscriptions and payment collection are disabled.
- The API key is supplied at runtime only. Never place it in source or connector metadata.

## Discoverable services

- Legal: Najiz (ناجز), Taradhi (تراضي), Moeen (معين), legal knowledge and bounded preparation.
- Workforce and Ministry services: Saudi Ministry of Human Resources and Social Development (HRSD/MHRSD / وزارة الموارد البشرية والتنمية الاجتماعية), Qiwa (قوى), GOSI (التأمينات الاجتماعية), Mudad (مدد), Ajeer (أجير), and Musaned (مساند) preparation.

Service availability comes from the live manifest. Preparation or guidance is never represented as completed government execution.

## Use

```js
import { createSaashConnector } from "@saash/agent-connector";

const saash = createSaashConnector({ baseUrl: "https://saash-gateway.vercel.app" });
const match = await saash.select("أحتاج تجهيز تصريح أجير");
```

Before invocation, inspect `match.trust`, `match.safety`, `match.access`, and the declared input schema. Set an API key only for an authorized professional call.

The same contract is available through OpenAPI 3.1.1, MCP discovery, and the A2A Agent Card. Public learning methods are `shareExperience`, `experienceStatus`, and `revokeExperience`; none requires or accepts a Gateway API key. Before constructing a contribution, read the strict live schema at `https://saash-gateway.vercel.app/openapi.json#/components/schemas/PublicExperienceSubmission` or the input schema published by the MCP tool `saash_grow_share_experience`; these are generated from the same validator used by the public endpoint.
