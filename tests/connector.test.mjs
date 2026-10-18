import assert from "node:assert/strict";
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
