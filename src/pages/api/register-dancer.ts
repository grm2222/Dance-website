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

  const lastName = field(data, 'lastName');
  const firstName = field(data, 'firstName');
  const birthDate = field(data, 'birthDate');
  const gender = field(data, 'gender');
  const club = field(data, 'club');
  const phone = field(data, 'phone');
  const email = field(data, 'email');

  if (!lastName || !firstName || !birthDate || !gender || !phone || !email) {
    return json({ ok: false, error: 'Шаардлагатай талбаруудыг бөглөнө үү.' }, 400);
  }
  // Checked before the format rules so an oversized payload is rejected early.
  if (tooLong({ lastName, firstName, club, phone, email })) {
    return json({ ok: false, error: 'Талбарын урт хэтэрсэн байна.' }, 400);
  }
  if (gender !== 'male' && gender !== 'female') {
    return json({ ok: false, error: 'Хүйс буруу байна.' }, 400);
  }
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime()) || birth > new Date() || birth.getFullYear() < 1920) {
    return json({ ok: false, error: 'Төрсөн огноо буруу байна.' }, 400);
  }
  if (!EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'Имэйл хаяг буруу байна.' }, 400);
  }
  if (!PHONE_RE.test(phone)) {
    return json({ ok: false, error: 'Утасны дугаар буруу байна.' }, 400);
  }

  if (!isWriteConfigured) {
    console.error('[api/register-dancer] Sanity project ID or write token is not configured.');
    return json({ ok: false, error: 'Серверийн тохиргоо дутуу байна. Дараа дахин оролдоно уу.' }, 503);
  }

  try {
    await writeClient().create({
      _type: 'dancerRegistrationRequest',
      lastName,
      firstName,
      birthDate,
      gender,
      club: club || undefined,
      phone,
      email,
      submittedAt: new Date().toISOString(),
      status: 'new',
    });
  } catch (error) {
    console.error('[api/register-dancer] Failed to create document:', error);
    return json({ ok: false, error: 'Хүсэлт хадгалахад алдаа гарлаа. Дахин оролдоно уу.' }, 502);
  }

  return json({ ok: true }, 201);
};
