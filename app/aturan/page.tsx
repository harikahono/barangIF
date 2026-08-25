import { AnnotatedText } from "../components/ui/AnnotatedText";

export default function AturanPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Aturan</h1>
      <p className="mb-6 mt-1 text-sm text-neutral-600">
        BarangIF itu papan pamer buat anak IF. Satu aturan main:{' '}
        <span className="font-medium text-neutral-900">
          yang paling banyak <AnnotatedText variant="wavy">vote</AnnotatedText> nangkring paling atas
        </span>
        . Tidak ada bayar, tidak ada iklan.
      </p>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Cara peringkat dihitung</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700">
          <li>
            Score = <code className="rounded bg-neutral-100 px-1"><AnnotatedText variant="box">upvotes</AnnotatedText> × 3 + klik</code>.
          </li>
          <li>Upvote gratis, satu kali per browser (dideteksi via localStorage).</li>
          <li>Klik ke situs/proyek juga naikin score, dihitung wajar (anti-farm).</li>
          <li>
            Papan dibagi dua: <AnnotatedText variant="circle" className="font-semibold">Situs</AnnotatedText> (web/app) dan <AnnotatedText variant="circle" className="font-semibold">Prompt</AnnotatedText>{' '}
            (prompt AI siap pakai).
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Yang boleh</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700">
          <li>Produk, portofolio, tools, atau prompt buatan lo sendiri (atau tim lo).</li>
          <li>Prompt AI yang berguna — sertakan body + variables biar gampang dipakai.</li>
          <li>Link ke situs/proyek asli (http/https).</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Yang nggak boleh</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700">
            <li>
              <AnnotatedText variant="crossOut">Judi online</AnnotatedText>,{' '}
              <AnnotatedText variant="crossOut">pinjol ilegal</AnnotatedText>,{' '}
              <AnnotatedText variant="crossOut">konten dewasa/NSFW</AnnotatedText>.
            </li>
          <li>Spam, duplikat, atau link pendek (bit.ly dkk) yang tujuannya bisa diubah.</li>
          <li>Konten yang gagal moderasi otomatis kita (toxic/abuse).</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Anti-spam</h2>
        <p className="text-sm text-neutral-700">
          Tiap form punya honeypot tersembunyi. Bot yang isi field itu otomatis ditolak. Submit
          juga di-rate-limit per IP biar gak kebanjir.
        </p>
      </section>
    </main>
  )
}
