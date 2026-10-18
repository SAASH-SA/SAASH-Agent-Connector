const DEFAULT_BASE_URL = "https://saash-gateway.vercel.app";

export class SaashAgentConnector {
  constructor({ baseUrl = DEFAULT_BASE_URL, apiKey = "", fetchImpl = globalThis.fetch } = {}) {
    if (typeof fetchImpl !== "function") throw new TypeError("fetch implementation is required");
    this.baseUrl = String(baseUrl).replace(/\/$/, "");
    this.apiKey = String(apiKey);
    this.fetch = fetchImpl;
  }

  async request(path, options = {}) {
    const headers = { accept: "application/json", ...(options.body ? { "content-type": "application/json" } : {}), ...(options.headers || {}) };
    if (this.apiKey) headers.authorization = `Bearer ${this.apiKey}`;
    const response = await this.fetch(new URL(path, this.baseUrl), { ...options, headers });
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) throw new Error(`SAASH returned non-JSON response (${response.status})`);
    const value = await response.json();
    if (!response.ok || value?.ok === false) {
      const error = new Error(value?.error?.message || `SAASH request failed (${response.status})`);
      error.code = value?.error?.code || "SAASH_REQUEST_FAILED";
      error.status = response.status;
      throw error;
    }
    return value;
  }

  discover() {
    return this.request("/api/v1/discovery");
  }

  manifest() {
    return this.request("/.well-known/saash-agent-connector.json");
  }

  resolve(intent, options = {}) {
    return this.request("/api/v1/connector/resolve", { method: "POST", body: JSON.stringify({ intent, ...options }) });
  }

  invoke({ engine_id, capability_id, payload = {}, request_id, grow_acknowledgement }) {
    if (!this.apiKey) {
      if (!grow_acknowledgement) {
        const error = new Error("accountless GROW invocation requires explicit no-secret, no-personal-data and no-effect acknowledgement");
        error.code = "GROW_ACKNOWLEDGEMENT_REQUIRED";
        throw error;
      }
      return this.request("/api/v1/connector/invoke", { method:"POST", body:JSON.stringify({ engine_id, capability_id, payload, request_id, grow_acknowledgement }) });
    }
    return this.request("/api/v1/invoke", { method: "POST", body: JSON.stringify({ engine_id, capability_id, payload, request_id }) });
  }

  async select(intent, options = {}) {
    const resolved = await this.resolve(intent, options);
    return resolved.matches?.[0] || null;
  }
}

export function createSaashConnector(options) {
  return new SaashAgentConnector(options);
}
