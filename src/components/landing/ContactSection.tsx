export function ContactSection() {
  return (
    <section id="contact" className="py-20 px-4 bg-blue-50">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6 text-blue-700">Hubungi Tim Jemputanku</h2>
          <p className="mb-6 text-gray-700 text-lg">Tertarik untuk bergabung atau ingin konsultasi solusi shuttle bus untuk instansi Anda? Silakan isi form atau hubungi kami langsung.</p>
          <div className="bg-white rounded-xl shadow p-6 mb-4">
            <p className="font-semibold text-blue-700 mb-2">Kontak Langsung</p>
            <p>Email: <a href="mailto:support@jemputanku.com" className="underline">support@jemputanku.com</a></p>
            <a
              href="https://wa.me/6281210867099"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-green-500 text-white rounded font-semibold hover:bg-green-600 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.52 3.48A12.07 12.07 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.98L0 24l6.19-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22c-1.77 0-3.5-.46-5.01-1.33l-.36-.21-3.68.96.98-3.59-.23-.37A9.94 9.94 0 0 1 2 12C2 6.48 6.48 2 12 2c2.54 0 4.93.99 6.73 2.77A9.93 9.93 0 0 1 22 12c0 5.52-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.34-.26.27-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/></svg>
              Chat via WhatsApp
            </a>
          </div>
        </div>
        <form className="bg-white rounded-xl shadow p-8 flex flex-col gap-4">
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-blue-700 mb-1">Nama</label>
            <input id="nama" name="nama" type="text" className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Nama Anda" required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-blue-700 mb-1">Email</label>
            <input id="email" name="email" type="email" className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="email@organisasi.com" required />
          </div>
          <div>
            <label htmlFor="pesan" className="block text-sm font-medium text-blue-700 mb-1">Pesan</label>
            <textarea id="pesan" name="pesan" rows={4} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Tulis pesan Anda di sini..." required />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition">Kirim Permintaan Demo</button>
        </form>
      </div>
    </section>
  );
}
