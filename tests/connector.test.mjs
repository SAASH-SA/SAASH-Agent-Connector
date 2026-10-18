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
