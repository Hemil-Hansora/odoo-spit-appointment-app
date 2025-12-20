export const authClient = {
  baseURL: "/api/auth",
  
  async signUp(data: { name: string; email: string; password: string }) {
    const response = await fetch(`${this.baseURL}/sign-up/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return parseResponse(response);
  },
  
  async signIn(data: { email: string; password: string }) {
    const response = await fetch(`${this.baseURL}/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return parseResponse(response);
  },
  
  async verifyEmail(data: { email: string; code: string }) {
    const response = await fetch(`${this.baseURL}/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return parseResponse(response);
  },
  
  async forgotPassword(data: { email: string }) {
    const response = await fetch(`${this.baseURL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return parseResponse(response);
  },
  
  async resetPassword(data: { token: string; password: string }) {
    const response = await fetch(`${this.baseURL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return parseResponse(response);
  },
};

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (isJson && body?.error) throw new Error(body.error);
    throw new Error(typeof body === "string" ? body.slice(0, 300) : "Request failed");
  }

  return body;
}
