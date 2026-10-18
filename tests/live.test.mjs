import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { Role } from "@a2a-js/sdk";
import { ClientFactory, JsonRpcTransportFactory } from "@a2a-js/sdk/client";
import { Client as McpClient, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { createSaashConnector } from "../index.mjs";

const baseUrl = "https://saash-gateway.vercel.app";

test("public package finds SAASH in Arabic and English", async () => {
  const connector = createSaashConnector({ baseUrl });
  const ar = await connector.select("أحتاج تجهيز تصريح أجير", { locale:"ar" });
  const en = await connector.select("I need to prepare an Ajeer permit", { locale:"en" });
  assert.equal(ar.capability_id, "ajeer.permit.prepare");
  assert.equal(en.engine_id, "saash-workforce-engine");
});

test("official MCP client discovers tools and invokes an eligible live GROW capability", async () => {
  const client = new McpClient({ name:"saash-public-repository-proof", version:"0.3.0" });
  const transport = new StreamableHTTPClientTransport(new URL("/api/mcp", baseUrl));
  try {
    await client.connect(transport);
    const tools = await client.listTools();
    assert.deepEqual(tools.tools.map((tool) => tool.name).sort(), ["saash_gateway_discover", "saash_grow_invoke", "saash_grow_share_experience", "saash_resolve"]);
    const learningSchema = tools.tools.find((tool) => tool.name === "saash_grow_share_experience").inputSchema;
    assert.deepEqual(learningSchema.properties.experience.required, ["protocol_version", "invocation", "consent", "skill", "experience", "privacy", "source_agent"]);
    assert.equal(learningSchema.properties.experience.properties.experience.properties.reusable_steps.minItems, 2);
    const openapi = await (await fetch(`${baseUrl}/openapi.json`)).json();
    const learningRules = openapi.paths["/api/v1/grow/experiences"].post["x-saash-public-learning-rules"];
    assert.equal(learningRules.new_capability_prefixes["saash-workforce-engine"], "workforce.learned.");
    assert.equal(learningRules.existing_capability_improvement_requires_same_invoked_capability, true);
    const result = await client.callTool({ name:"saash_grow_invoke", arguments:{ engine_id:"saash-workforce-engine", capability_id:"ajeer.permit.prepare", payload:{ synthetic_fixture:true }, request_id:`github-proof-${Date.now()}`, grow_acknowledgement:{ no_secrets:true, no_personal_data:true, no_external_or_binding_effect:true } } });
    assert.equal(result.isError, false);
    assert.equal(result.structuredContent.gateway.price_minor, 0);
    assert.equal(result.structuredContent.gateway.account_required, false);
  } finally { await client.close(); }
});

test("official A2A v1 client resolves an English request through the live Agent Card", async () => {
  const client = await new ClientFactory({ transports:[new JsonRpcTransportFactory()] }).createFromUrl(baseUrl);
  const response = await client.sendMessage({ tenant:"", message:{ messageId:randomUUID(), contextId:"", taskId:"", role:Role.ROLE_USER, parts:[{ content:{ $case:"text", value:"I need to prepare an Ajeer permit" }, metadata:undefined, filename:"", mediaType:"text/plain" }], metadata:undefined, extensions:[], referenceTaskIds:[] }, configuration:undefined, metadata:undefined });
  assert.equal(response.parts[1].content.value.matches[0].engine_id, "saash-workforce-engine");
});
