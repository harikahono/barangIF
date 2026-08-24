export default function TentangPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Tentang</h1>
      <p className="mb-6 mt-1 text-sm text-neutral-600">
        <strong>BarangIF</strong> itu tempat pamer barang buat anak IF — Situs &amp; Prompt, di-rank
        by vote. Dibuat karena papan semisal pamerin.lol keren, tapi kita pengen yang gratis dan
        murni suara komunitas.
      </p>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Bedanya apa</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700">
          <li>
            <strong>Vote, bukan bayar.</strong> Posisi ditentukan upvote &amp; klik, bukan nominal
            sponsor.
          </li>
          <li>
            <strong>Dua papan.</strong> Situs buat web/app, Prompt buat prompt AI siap pakai.
          </li>
          <li>
            <strong>Gratis &amp; tanpa login.</strong> Tinggal pamer, tinggal vote.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Cara kerjanya</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-neutral-700">
          <li>Isi form di beranda — pilih Situs atau Prompt, lengkapi detailnya.</li>
          <li>Listing langsung masuk papan.</li>
          <li>Orang lain upvote &amp; klik → score naik → nangkring lebih atas.</li>
          <li>
            Mau naik? Share ke temen biar mereka vote. Tidak ada tombol bayar 🤝
          </li>
        </ol>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Jujur soal ini</h2>
        <p className="text-sm text-neutral-700">
          BarangIF tidak menjanjikan viral atau penjualan. Yang lo dapet adalah tempat pamer + vote
          dari orang yang lewat. Kalau nanti ada yang overtake, ya emang begitu mainnya.
        </p>
      </section>
    </main>
  )
}
