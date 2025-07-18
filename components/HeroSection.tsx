import React from 'react';

const App: React.FC = () => {
  return (
    // Main container for the hero section with a dark background
    <section className="relative min-h-screen text-white py-28 md:py-48"
      style={{
        backgroundImage: 'linear-gradient(to right, #183449 0%, #47525B 25%, #0C2A46 48%, #213950 66%, #0C1824 89%)'
      }}
      >
      {/* Content container, centered and with max width */}
      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Small top text with rounded background */}
                <div className="inline-block bg-white bg-blur bg-opacity-20 text-sm md:text-base px-5 py-2 rounded-full mb-6 shadow-md">
          CV. Reswara Praptama • Profesionalisme No.1
        </div>

        {/* Main heading */}
        <h1 className="max-w-4xl mx-auto text-center text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
          Dari Izin hingga Konstruksi, Solusi Menyeluruh untuk Proyek Anda.
        </h1>

        {/* Supporting paragraph */}
        <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto opacity-90">
          99% klien kami berhasil memperoleh izin bangunan dan lingkungan tanpa revisi besar berkat pendampingan teknis kami yang komprehensif sejak tahap awal.
        </p>

        {/* Call to action button */}
        <button className="bg-white bg-blur bg-opacity-20 hover:bg-blur text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-4  focus:ring-opacity-50">
          Coba Kontak Kami!
        </button>
      </div>

      {/* Symmetrical rounded SVG at the bottom for separation */}
      <div className="absolute bottom-0 left-0 w-full z-0">
        <svg
          className="block"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120" // ViewBox height to accommodate the curve
          preserveAspectRatio="none"
        >
          {/* Path for a symmetrical rounded bottom, curving downwards */}
          <path
            fill="#ffffff" // Color of the next section (white)
            fillOpacity="1"
            d="M0,0 C360,160 1080,160 1440,0 L1440,120 L0,120 Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default App;
