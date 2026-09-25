import { NextRequest, NextResponse } from "next/server";
import https from "https";
import axios from "axios";
import Config from "../../../config/config";

const backendBaseUrl = (Config as any).BACKEND_API_URL || "https://api.example.com/api/v1";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

async function proxyRequest(request: NextRequest, paramsPromise: Promise<{ path: string[] }>) {
  const { path } = await paramsPromise;
  const pathStr = Array.isArray(path) ? path.join("/") : "";
  const cleanPath = pathStr.replace(/^\/+|\/+$/g, "");
  const search = request.nextUrl.search || "";
  const targetUrl = `${backendBaseUrl}/${cleanPath}/${search}`;

  try {
    const method = request.method;
    let body = undefined;

    if (method !== "GET" && method !== "HEAD") {
      try {
        body = await request.json();
      } catch {
        // No body or not JSON
      }
    }

    const response = await axios({
      method: method,
      url: targetUrl,
      data: body,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      httpsAgent: httpsAgent,
      validateStatus: () => true,
    });

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error: any) {
    console.error(`Proxy error forwarding to ${targetUrl}:`, error.message);
    return NextResponse.json(
      { error: "Proxy request failed", message: error.message },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, params);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, params);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, params);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, params);
}