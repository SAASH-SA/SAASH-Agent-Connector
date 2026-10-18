# SAASH Agent Connector

Provider-neutral bilingual connector for Saudi government, citizen, business, commerce, workforce and legal capabilities through SAASH Government Engine, SAASH Business Engine, SAASH Workforce Engine and SAASH Legal Engine.

Public source and releases: https://github.com/SAASH-SA/SAASH-Agent-Connector

## Current GROW access

- Discovery and intent resolution are public, account-free and free of charge.
- Non-effect, non-binding professional invocation is account-free, rate-limited and requires an explicit no-secret/no-personal-data/no-effect acknowledgement.
- A successful public invocation returns a signed single-use receipt. A compatible agent may submit a sanitized, explicitly shared `saash.agent-experience.v2` contribution without an account; another specialist engine must verify it before publication.
- After successful specialist publication, the affected engine catalogue is refreshed immediately so a new consumer can discover and invoke the learned capability without waiting for the periodic synchronization window.
- The invocation response publishes machine-readable contribution constraints. A new engine named `saash-<domain>-engine` receives the isolated `<domain>.learned.*` namespace automatically; an improvement to an existing capability requires a receipt from invoking that same capability.
- Public invocation has no per-client-network daily quota. Accepted calls share a provider-aligned budget of 800,000 per calendar month, derived from the current one-million monthly Vercel Function allowance with a 20% operating reserve. Minute-level protection remains 60 per client network and 600 globally. The budget is not an SLA. Experience contribution is separately limited to 20 per client network daily.
- Every accepted public contribution returns a one-time management secret for private status checks and contributor revocation. Store it securely; the service stores only its hash.
- Effectful, binding and owner-controlled invocation remains authorization-gated.
- Registration, subscriptions and payment collection are disabled.
- The API key is supplied at runtime only. Never place it in source or connector metadata.

## Discoverable services

- Legal: Najiz (ناجز), Taradhi (تراضي), Moeen (معين), legal knowledge and bounded preparation.
- Workforce and Ministry services: Saudi Ministry of Human Resources and Social Development (HRSD/MHRSD / وزارة الموارد البشرية والتنمية الاجتماعية), Qiwa (قوى), GOSI (التأمينات الاجتماعية), Mudad (مدد), Ajeer (أجير), and Musaned (مساند) preparation.
- Business services: Ministry of Commerce (وزارة التجارة), Saudi Business Center (المركز السعودي للأعمال), MISA, ZATCA, Balady, Monsha'at and SAIP lifecycle, compliance, document and workflow capabilities.
- Government and citizen services: GOV.SA, Absher, Nafath-aware owner handoff, Tawakkalna Services, Sehhaty, Noor, social support, Sakani, SPL National Address and Nusuk preparation and workflow capabilities. Authentication, OTP, payment, signature and binding submission remain owner-controlled.

Service availability comes from the live manifest. Preparation or guidance is never represented as completed government execution.

Indexable capability-family pages:

- Saudi legal agent / وكيل الخدمات القانونية السعودية: https://saash-gateway.vercel.app/saudi-legal-agent
- Saudi workforce and HRSD agent / وكيل خدمات العمل والموارد البشرية: https://saash-gateway.vercel.app/saudi-workforce-agent
- Saudi business and enterprise agent / وكيل خدمات الأعمال والمنشآت: https://saash-gateway.vercel.app/saudi-business-agent
- Saudi government and citizen services agent / وكيل الخدمات الحكومية والمواطن: https://saash-gateway.vercel.app/saudi-government-agent
- Verified accountless agent learning / تعلم خبرات الوكلاء دون حساب: https://saash-gateway.vercel.app/agent-learning

## Use

```js
import { createSaashConnector } from "@saash/agent-connector";

const saash = createSaashConnector({ baseUrl: "https://saash-gateway.vercel.app" });
const match = await saash.select("أحتاج تجهيز تصريح أجير");
```

Before invocation, inspect `match.trust`, `match.safety`, `match.access`, and the declared input schema. Set an API key only for an authorized professional call.

The same contract is available through OpenAPI 3.1.1, MCP discovery, and the A2A Agent Card. Public learning methods are `shareExperience`, `experienceStatus`, and `revokeExperience`; none requires or accepts a Gateway API key. Before constructing a contribution, read the strict live schema at `https://saash-gateway.vercel.app/openapi.json#/components/schemas/PublicExperienceSubmission` or the input schema published by the MCP tool `saash_grow_share_experience`; these are generated from the same validator used by the public endpoint.
