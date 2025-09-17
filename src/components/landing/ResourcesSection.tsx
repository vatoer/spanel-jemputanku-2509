export function ResourcesSection() {
  return (
    <section id="resources" className="py-16 px-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-10 text-blue-700">Resources & Bantuan</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-lg mb-2 text-blue-600">Pusat Bantuan</h3>
          <p className="text-gray-700">Temukan panduan penggunaan, FAQ, dan tips untuk memaksimalkan features Jemputanku.</p>
          <a href="#" className="text-blue-600 hover:underline mt-2 inline-block">Lihat Bantuan</a>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-lg mb-2 text-blue-600">Dokumentasi API</h3>
          <p className="text-gray-700">Integrasikan Jemputanku dengan sistem internal Anda menggunakan API yang lengkap dan mudah digunakan.</p>
          <a href="#" className="text-blue-600 hover:underline mt-2 inline-block">Lihat Dokumentasi</a>
        </div>
      </div>
    </section>
  );
}
