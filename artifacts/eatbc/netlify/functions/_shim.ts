/**
 * Adapts a Vercel-style default export handler to a Netlify Function handler.
 * Mocks VercelRequest/VercelResponse so existing API files can run unchanged.
 */
export function adapt(vercelHandler: (req: any, res: any) => Promise<any>) {
  return async (event: any) => {
    const cors = {
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "content-type, authorization",
      "access-control-allow-methods": "GET, POST, DELETE, OPTIONS",
    };

    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 204, headers: cors, body: "" };
    }

    let statusCode = 200;
    const headers: Record<string, string> = {
      "content-type": "application/json",
      ...cors,
    };
    let bodyStr = "";
    let isBase64Encoded = false;

    const reqHeaders: Record<string, string> = Object.fromEntries(
      Object.entries(event.headers || {}).map(([k, v]) => [k.toLowerCase(), String(v)])
    );

    const ip = (reqHeaders["x-forwarded-for"] || "unknown").split(",")[0].trim();

    const req: any = {
      method: event.httpMethod,
      headers: reqHeaders,
      query: event.queryStringParameters || {},
      socket: { remoteAddress: ip },
      body: {},
    };

    if (event.body) {
      const ct = reqHeaders["content-type"] || "";
      if (ct.includes("application/json")) {
        try { req.body = JSON.parse(event.body); } catch { req.body = {}; }
      } else {
        req.body = event.body;
      }
    }

    const res: any = {
      status(code: number) { statusCode = code; return this; },
      json(data: unknown) {
        headers["content-type"] = "application/json";
        bodyStr = JSON.stringify(data);
        return this;
      },
      setHeader(k: string, v: string | number) {
        headers[k.toLowerCase()] = String(v);
        return this;
      },
      send(data: Buffer | string) {
        if (Buffer.isBuffer(data)) {
          bodyStr = data.toString("base64");
          isBase64Encoded = true;
        } else {
          bodyStr = String(data);
        }
        return this;
      },
      end(data?: string) { bodyStr = data || ""; return this; },
    };

    await vercelHandler(req, res);
    return { statusCode, headers, body: bodyStr, isBase64Encoded };
  };
}
