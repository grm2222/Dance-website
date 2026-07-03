import type { APIRoute } from 'astro';
import { createClient } from '@sanity/client';

export const prerender = false;

// `||` not `??`: empty values in .env come through as '' and must count as unset.
const projectId = (import.meta.env.PUBLIC_SANITY_PROJECT_ID as string | undefined) || undefined;
const dataset = (import.meta.env.PUBLIC_SANITY_DATASET as string | undefined) || 'production';
const writeToken = (import.meta.env.SANITY_WRITE_TOKEN as string | undefined) || undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s-]{5,20}$/;

function json(body: { ok: boolean; error?: string }, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function field(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

export const POST: APIRoute = async ({ request }) => {
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return json({ ok: false, error: 'Буруу хүсэлт байна.' }, 400);
  }

  // Honeypot: bots fill the hidden "website" field — pretend success, store nothing.
  if (field(data, 'website') !== '') {
    return json({ ok: true }, 200);
  }

  const orgName = field(data, 'orgName');
  const about = field(data, 'about');
  const address = field(data, 'address');
  const phone = field(data, 'phone');
  const email = field(data, 'email');

  if (!orgName || !about || !address || !phone || !email) {
    return json({ ok: false, error: 'Бүх талбарыг бөглөнө үү.' }, 400);
  }
  if (!EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'Имэйл хаяг буруу байна.' }, 400);
  }
  if (!PHONE_RE.test(phone)) {
    return json({ ok: false, error: 'Утасны дугаар буруу байна.' }, 400);
  }

  if (!projectId || !writeToken) {
    console.error('[api/register] Sanity project ID or write token is not configured.');
    return json({ ok: false, error: 'Серверийн тохиргоо дутуу байна. Дараа дахин оролдоно уу.' }, 503);
  }

  const writeClient = createClient({
    projectId,
    dataset,
    apiVersion: '2026-06-01',
    token: writeToken,
    useCdn: false,
  });

  try {
    await writeClient.create({
      _type: 'registrationRequest',
      orgName,
      about,
      address,
      phone,
      email,
      submittedAt: new Date().toISOString(),
      status: 'new',
    });
  } catch (error) {
    console.error('[api/register] Failed to create registrationRequest:', error);
    return json({ ok: false, error: 'Хүсэлт хадгалахад алдаа гарлаа. Дахин оролдоно уу.' }, 502);
  }

  return json({ ok: true }, 201);
};
