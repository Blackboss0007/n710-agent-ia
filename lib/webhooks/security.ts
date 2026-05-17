import crypto from "crypto";
import { NextResponse } from "next/server";

const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit = 60, windowMs = 60_000) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) {
    return false;
  }

  bucket.count += 1;
  return true;
}

export function timingSafeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

export function validateSharedSecret(request: Request, envName: string, headers: string[]) {
  const expected = process.env[envName];

  if (!expected) {
    return NextResponse.json({ error: `${envName} is not configured.` }, { status: 500 });
  }

  const provided = headers
    .map((header) => request.headers.get(header))
    .find(Boolean)
    ?.replace(/^Bearer\s+/i, "");

  if (!provided || !timingSafeEqual(provided, expected)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  return null;
}
