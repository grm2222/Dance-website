/**
 * Shared plumbing for the two public registration endpoints.
 *
 * Both forms are unauthenticated and have no CAPTCHA (see CLAUDE.md), so the
 * server — not the browser — is the only real gate. Anything here runs on
 * every submission, including ones posted straight at the endpoint by a bot
 * that never loaded the form.
 */
import { createClient, type SanityClient } from '@sanity/client';

// `||` not `??`: empty values in .env come through as '' and must count as unset.
const projectId = (import.meta.env.PUBLIC_SANITY_PROJECT_ID as string | undefined) || undefined;
const dataset = (import.meta.env.PUBLIC_SANITY_DATASET as string | undefined) || 'production';
const writeToken = (import.meta.env.SANITY_WRITE_TOKEN as string | undefined) || undefined;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_RE = /^[+\d][\d\s-]{5,20}$/;

/**
 * Maximum accepted length per field, mirroring the `maxlength` attributes on
 * the forms. The browser enforces those for real people; this enforces them
 * for everyone else. Without a cap a single POST can carry megabytes, and the
 * Sanity free tier is a quota we cannot afford to let a bot spend.
 */
export const LIMITS = {
  orgName: 200,
  about: 2000,
  address: 300,
  lastName: 100,
  firstName: 100,
  club: 200,
  phone: 30,
  email: 200,
} as const;

export type FieldName = keyof typeof LIMITS;

export function json(body: { ok: boolean; error?: string }, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Reads a trimmed string field; non-string parts (a file upload) read as ''. */
export function field(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * The first field that exceeds its cap, or null when all are within limits.
 * Returning the name rather than throwing keeps the caller's error messages
 * in Mongolian and in one place.
 */
export function tooLong(values: Partial<Record<FieldName, string>>): FieldName | null {
  for (const [name, value] of Object.entries(values) as [FieldName, string | undefined][]) {
    if (value && value.length > LIMITS[name]) return name;
  }
  return null;
}

/** True when the honeypot was filled — a bot. Callers answer 200 and store nothing. */
export function isBot(data: FormData): boolean {
  return field(data, 'website') !== '';
}

export const isWriteConfigured = Boolean(projectId && writeToken);

/**
 * Client with write access, for creating the request document. Built per call
 * rather than at module load so an unconfigured environment fails with a
 * handled 503 instead of crashing the whole route on import.
 */
export function writeClient(): SanityClient {
  return createClient({
    projectId: projectId as string,
    dataset,
    apiVersion: '2026-06-01',
    token: writeToken,
    useCdn: false,
  });
}
