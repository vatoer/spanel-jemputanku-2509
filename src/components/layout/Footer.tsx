export function Footer() {
  return (
    <footer className="w-full bg-blue-900 text-white py-10 mt-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="mb-4 md:mb-0">
          <span className="font-bold text-2xl tracking-tight">Jemputanku</span>
          <p className="text-blue-200 mt-2 max-w-xs text-sm">
            Platform manajemen shuttle bus untuk instansi pemerintah & organisasi modern.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 text-sm">
          <div>
            <div className="font-semibold mb-2">Navigasi</div>
            <ul className="space-y-1">
              <li><a href="#features" className="hover:underline">Features</a></li>
              <li><a href="#products" className="hover:underline">Products</a></li>
              <li><a href="#resources" className="hover:underline">Resources</a></li>
              <li><a href="#pricing" className="hover:underline">Pricing</a></li>
              <li><a href="#contact" className="hover:underline">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Kontak</div>
            <ul className="space-y-1">
              <li>Email: <a href="mailto:support@jemputanku.com" className="hover:underline">support@jemputanku.com</a></li>
              <li>Telepon: <a href="tel:+62123456789" className="hover:underline">+62 123-456-789</a></li>
            </ul>
          </div>
        </div>
        <div className="text-xs text-blue-300 mt-4 md:mt-0">&copy; {new Date().getFullYear()} Jemputanku. All rights reserved.</div>
      </div>
    </footer>
  );
}
