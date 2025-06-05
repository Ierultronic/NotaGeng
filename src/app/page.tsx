// app/page.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#FFE1E9]">
      {/* Navbar */}
      {/* Hero Section */}
      <section className="flex flex-col-reverse lg:flex-row items-center justify-between flex-grow px-6 lg:px-20 py-16">
        {/* Left: Text */}
        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-purple-800">
            Kuliah, Tugasan, & Nota
            <span className="text-pink-500"> — Semua Dalam Satu</span>
          </h2>
          <p className="text-gray-700 max-w-md mx-auto lg:mx-0 text-lg">
            NotaGeng memudahkan korang berkongsi dan organize semua nota subjek. Geng
            study jadi lebih seronok — tak payah risau hilang kertas!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            {/* Disabled “Daftar” button until auth is ready */}
            <button
              disabled
              className="px-6 py-3 bg-purple-400 text-white font-semibold rounded-md shadow opacity-60 cursor-not-allowed"
            >
              Jom Daftar (Coming Soon)
            </button>

            {/* Disabled “Dashboard” button until auth is ready */}
            <button
              disabled
              className="px-6 py-3 border-2 border-pink-300 text-pink-300 font-semibold rounded-md opacity-60 cursor-not-allowed"
            >
              Explore Nota Shared (Coming Soon)
            </button>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="w-full lg:w-1/2 mb-10 lg:mb-0 flex justify-center">
          <Image
            src="/illustrations/study-mascot.png"
            alt="Study Mascot"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-6 lg:px-20">
        <h3 className="text-3xl font-bold text-purple-800 text-center mb-10">
          Apa Yang Korang Boleh Buat?
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
            <span className="text-5xl mb-3">📂</span>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Organize Semua Nota</h4>
            <p className="text-gray-600">
              Simpan nota Sejarah, Sains, Bahasa, Matematik—semuanya dalam folder subjek tersusun.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
            <span className="text-5xl mb-3">📲</span>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Kongsi Senang Giler</h4>
            <p className="text-gray-600">
              Hantar pautan nota ke WhatsApp, Telegram, atau share dekat group geng belajar.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
            <span className="text-5xl mb-3">🔍</span>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Cari, Cari, Cepat Dapat</h4>
            <p className="text-gray-600">
              Cari nota ikut tajuk, tag, atau subjek—tak perlu skim semua fail lama.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
            <span className="text-5xl mb-3">⭐</span>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Rating & Ulasan</h4>
            <p className="text-gray-600">
              Nilai nota kawan atau beri feedback—bantu geng korang upgrade nota lagi power!
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
            <span className="text-5xl mb-3">🔒</span>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Privasi Tersendiri</h4>
            <p className="text-gray-600">
              Boleh pilih private (cuma korang boleh tengok) atau share dengan geng belajar.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
            <span className="text-5xl mb-3">📱</span>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Responsive & Mobile-Ready</h4>
            <p className="text-gray-600">
              Boleh baca nota on-the-go, reload page cepat, experience smooth & pantas.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Banner */}
      <section className="bg-purple-700 text-white py-12 px-6 lg:px-20 text-center">
        <h3 className="text-2xl sm:text-3xl font-bold">Dah Ready Untuk Study Gempak?</h3>
        <p className="mt-2 max-w-lg mx-auto">
          Daftar sekarang dan mula kongsi nota dengan geng study korang—Percuma je, lung sibuk! 👍
        </p>
        <Link
          href="/register"
          className="mt-6 inline-block px-8 py-3 bg-pink-500 text-white font-semibold rounded-md hover:bg-pink-600 transition"
        >
          Jom Daftar Percuma
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 py-8 px-6 lg:px-20">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Tentang NotaGeng</h4>
            <p className="text-gray-600 text-sm">
              NotaGeng ialah platform untuk rakan-rakan sekolah dan universiti berkongsi nota
              dengan mudah. Build bersama semangat “geng belajar”.
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Hubungi Kami</h4>
            <a href="#" className="text-gray-600 text-sm hover:underline">
              Terma & Syarat
            </a>
            <a href="#" className="text-gray-600 text-sm hover:underline">
              Dasar Privasi
            </a>
            <a href="#" className="text-gray-600 text-sm hover:underline">
              support@notageng.app
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} NotaGeng. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
