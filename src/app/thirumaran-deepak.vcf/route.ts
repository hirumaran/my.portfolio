import { profile } from '@/data/resume';

export const dynamic = 'force-static';

function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

export function GET() {
  const phone = `+1${profile.phone.replace(/\D/g, '')}`;
  const card = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escapeVCard(profile.lastName)};${escapeVCard(profile.firstName)};;;`,
    `FN:${escapeVCard(profile.name)}`,
    `TITLE:${escapeVCard(profile.role)}`,
    `TEL;TYPE=CELL:${phone}`,
    `EMAIL;TYPE=INTERNET:${escapeVCard(profile.email)}`,
    `item1.URL:${profile.linkedin}`,
    'item1.X-ABLabel:LinkedIn',
    `X-SOCIALPROFILE;TYPE=linkedin:${profile.linkedin}`,
    `item2.URL:${profile.github}`,
    'item2.X-ABLabel:GitHub',
    `NOTE:${escapeVCard(`${profile.role} · ${profile.location}`)}`,
    'END:VCARD',
    '',
  ].join('\r\n');

  return new Response(card, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'Content-Disposition': 'attachment; filename="Thirumaran-Deepak.vcf"',
      'Content-Type': 'text/vcard; charset=utf-8',
    },
  });
}
