import type { APIRoute } from 'astro';
import {
  EMAIL_RE,
  PHONE_RE,
  field,
  isBot,
  isWriteConfigured,
  json,
  tooLong,
  writeClient,
} from '../../lib/registration';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return json({ ok: false, error: 'Буруу хүсэлт байна.' }, 400);
  }

  // Honeypot: bots fill the hidden "website" field — pretend success, store nothing.
  if (isBot(data)) {
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
  // Checked before the format rules so an oversized payload is rejected early.
  if (tooLong({ orgName, about, address, phone, email })) {
    return json({ ok: false, error: 'Талбарын урт хэтэрсэн байна.' }, 400);
  }
  if (!EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'Имэйл хаяг буруу байна.' }, 400);
  }
  if (!PHONE_RE.test(phone)) {
    return json({ ok: false, error: 'Утасны дугаар буруу байна.' }, 400);
  }

  if (!isWriteConfigured) {
    console.error('[api/register] Sanity project ID or write token is not configured.');
    return json({ ok: false, error: 'Серверийн тохиргоо дутуу байна. Дараа дахин оролдоно уу.' }, 503);
  }

  try {
    await writeClient().create({
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
