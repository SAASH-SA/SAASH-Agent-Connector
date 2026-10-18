import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createSaashConnector } from "../index.mjs";

test("connector resolves bilingually without storing credentials", async () => {
  const requests = [];
  const connector = createSaashConnector({ baseUrl:"https://example.test", fetchImpl:async (url, options={}) => {
    requests.push({ url:String(url), options });
    return new Response(JSON.stringify({ ok:true, matches:[{ engine_id:"saash-workforce-engine", capability_id:"ajeer.permit.prepare" }] }), { status:200, headers:{ "content-type":"application/json" } });
  }});
  const match = await connector.select("أحتاج تجهيز تصريح أجير", { locale:"ar" });
  assert.equal(match.capability_id, "ajeer.permit.prepare");
  assert.equal(requests[0].options.headers.authorization, undefined);
});

test("connector exposes accountless experience contribution and management without API credentials",async()=>{
  const requests=[];
  const connector=createSaashConnector({baseUrl:"https://example.test",fetchImpl:async(url,options={})=>{requests.push({url:String(url),options});return new Response(JSON.stringify({ok:true,status:"PUBLISHED_AND_DISCOVERABLE"}),{status:200,headers:{"content-type":"application/json"}})}});
  await connector.shareExperience({receipt:"signed-receipt",experience:{protocol_version:"saash.agent-experience.v2"}});
  await connector.experienceStatus({experience_id:"aexp_123",revocation_token:"sgrv_secret"});
  await connector.revokeExperience({experience_id:"aexp_123",revocation_token:"sgrv_secret"});
  assert.deepEqual(requests.map(item=>new URL(item.url).pathname),["/api/v1/grow/experiences","/api/v1/grow/experiences/aexp_123/status","/api/v1/grow/experiences/aexp_123/revoke"]);
  assert.equal(requests.every(item=>item.options.headers.authorization===undefined),true);
});

test("packaged metadata matches the expanded provider-aligned GROW policy", async () => {
  const metadata = JSON.parse(await readFile(new URL("../connector.json", import.meta.url), "utf8"));
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
  assert.equal(metadata.version, "0.7.0");
  assert.equal(metadata.service_directory_path, "/services");
  assert.equal(metadata.llms_full_path, "/llms-full.txt");
  assert.equal(metadata.sitemap_path, "/sitemap.xml");
  assert.equal(metadata.grow_experience_rules["example_saash-government-engine_new_capability_prefix"], "government.learned.");
  assert.match(readme, /Government Engine/);
  assert.equal(metadata.grow_experience_rules["example_saash-accounting-engine_new_capability_prefix"], "accounting.learned.");
  assert.equal(metadata.learned_capability_visibility, "IMMEDIATE_AFTER_SUCCESSFUL_RELEASE");
  assert.equal(metadata.capacity_policy.per_client_network_daily_invocation_limit, null);
  assert.equal(metadata.capacity_policy.provider_aligned_monthly_accepted_invocation_budget, 800000);
  assert.match(readme, /no per-client-network daily quota/);
  assert.doesNotMatch(readme, /1000 requests per client network daily/);
  assert.match(readme, /live capability directory/i);
});
