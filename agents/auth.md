# Auth — barangIF

## Tidak ada auth / akun.
barangIF sengaja **tanpa login** (lihat SPEC §6 & ADR). Aman tanpa akun lewat
kombinasi:

- **Submit-time moderation**: OpenAI Moderation API (gratis) nolak konten
  sexual/hate/violence/self-harm. Di dev lokal di-stub (`lib/moderation.ts`,
  lewati kalau gak ada `OPENAI_API_KEY`).
- **Honeypot**: field tersembunyi `website` di `SubmitForm`; kalau diisi → bot,
  submit ditolak.
- **Rate limit**: 5 submit / 10 menit / IP (`lib/rateLimit.ts`).
- **Validasi server**: URL harus http(s), panjang field di-cap, html aman
  (gak ada stored XSS karena cuma di-render sebagai text).
- **Community Report + owner token**: Phase 2 (belum ada di scaffold ini).

## Trade-off
Moderasi otomatis + komunitas gak 100% (esp. nuansa SARA halus), tapi cukup buat
portfolio demo. Admin beneran bisa ditambah nanti via route yang di-gate env.

## Owner token (rencana P2)
Saat submit, server kasih token sekali pakai → `/manage/[token]` buat
self-delete/edit. Butuh `SUPABASE_SERVICE_ROLE_KEY` (privileged) karena anon gak
boleh DELETE.
