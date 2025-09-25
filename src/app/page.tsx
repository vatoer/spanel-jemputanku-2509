
import { ContactSection } from "@/components/landing/ContactSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ProductsSection } from "@/components/landing/ProductsSection";
import { ResourcesSection } from "@/components/landing/ResourcesSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center py-20 px-4 text-center bg-blue-600 text-white">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
        Jemputanku Shuttle Management
      </h1>
      <p className="text-lg md:text-2xl max-w-2xl mb-8">
        Solusi modern untuk pengelolaan bus jemputan instansi pemerintah & organisasi. Mudahkan operasional, tingkatkan kepuasan penumpang, dan maksimalkan efisiensi armada Anda.
      </p>
      <div className="flex gap-4 flex-col sm:flex-row">
        <a href="#pricing" className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-full shadow hover:bg-blue-100 transition">
          Lihat Paket & Bergabung
        </a>
        <div className="flex gap-2">
          <Link href="/login">
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="secondary">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}



function PricingSection() {
  return (
    <section id="pricing" className="py-16 px-4 bg-blue-50">
      <h2 className="text-3xl font-bold text-center mb-10 text-blue-700">Paket Harga</h2>
      <div className="flex flex-col md:flex-row gap-8 justify-center">
        {/* Basic */}
        <div className="bg-white rounded-xl shadow p-8 flex-1 max-w-sm mx-auto border-2 border-blue-200">
          <h3 className="text-xl font-bold mb-2 text-blue-600">Basic</h3>
          <p className="mb-4 text-gray-700">Cocok untuk tenant kecil & uji coba</p>
          <ul className="mb-6 text-gray-700 list-disc list-inside text-left">
            <li>Manajemen bus & jadwal</li>
            <li>Dashboard dasar</li>
            <li>Support email</li>
          </ul>
          <div className="text-2xl font-bold mb-4">Rp 500.000/bulan</div>
          <a href="#" className="bg-blue-200 text-blue-700 px-6 py-2 rounded-full font-semibold hover:bg-blue-300 transition">Pilih Paket</a>
        </div>
        {/* Pro */}
        <div className="bg-white rounded-xl shadow p-8 flex-1 max-w-sm mx-auto border-2 border-blue-400 scale-105">
          <h3 className="text-xl font-bold mb-2 text-blue-600">Pro</h3>
          <p className="mb-4 text-gray-700">Untuk tenant menengah & besar</p>
          <ul className="mb-6 text-gray-700 list-disc list-inside text-left">
            <li>Semua features Basic</li>
            <li>Integrasi absensi & payroll</li>
            <li>Custom domain & branding</li>
            <li>Support prioritas</li>
          </ul>
          <div className="text-2xl font-bold mb-4">Rp 1.500.000/bulan</div>
          <a href="#" className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition">Pilih Paket</a>
        </div>
        {/* Enterprise */}
        <div className="bg-white rounded-xl shadow p-8 flex-1 max-w-sm mx-auto border-2 border-yellow-400">
          <h3 className="text-xl font-bold mb-2 text-yellow-600">Enterprise</h3>
          <p className="mb-4 text-gray-700">Solusi kustom & skala besar</p>
          <ul className="mb-6 text-gray-700 list-disc list-inside text-left">
            <li>Semua features Pro</li>
            <li>Integrasi sistem internal</li>
            <li>Support 24/7 & SLA</li>
            <li>Features kustom sesuai kebutuhan</li>
          </ul>
          <div className="text-2xl font-bold mb-4">Hubungi Kami</div>
          <a href="#" className="bg-yellow-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-yellow-600 transition">Hubungi Sales</a>
        </div>
      </div>
    </section>
  );
}

function CallToActionSection() {
  return (
    <section className="py-16 px-4 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-700">Siap Mengelola Shuttle Bus Anda Lebih Mudah?</h2>
      <a href="#" className="bg-blue-600 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition">Daftar Sekarang</a>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col">
        <HeroSection />
  <FeaturesSection />
  <ProductsSection />
  <ResourcesSection />
  <PricingSection />
  <ContactSection />
  <CallToActionSection />
        <PricingSection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
}
