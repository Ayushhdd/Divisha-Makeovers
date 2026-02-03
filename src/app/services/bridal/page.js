"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import ClosingEditorial from "@/app/components/ClosingEditorial";

const bridalSections = [
  {
    title: "Classic Bridal Package",
    price: "₹ 16,500",
    desc: "A timeless bridal look with traditional techniques, perfect for natural elegance and long ceremonies.",
    includes: [
      "Basic Bridal Makeup",
      "Bridal hairstyling",
      "Eyelashes",
      "Coloured lenses",
      "Outfit draping",
      "Hair extensions (If needed)",
    ],
    notes: [
      "Fresh flowers need to be carried by the client themselves.",
      "Booking is non-refundable and non-adjustable.",
      "No hair washing service is provided. Please arrive with clean, dry hair. Shampoo or hair washing is not included.",
    ],
    images: [
      "/classic/classic1.jpg",
      "/classic/classic2.jpg",
      "/classic/classic3.jpg",
      "/classic/classic4.jpg",
    ],
  },
  {
    title: "Signature Highly Defined (HD) Bridal Package",
    price: "₹ 22,500",
    desc: "Our Signature High Definition Bridal Makeup is designed to help you look radiant and picture-perfect on your special day. This look is curated after understanding the bride's personal preferences and style. Only premium international brands are used to deliver a flawless, long-lasting, and camera-ready finish with advanced and modern hairstyling techniques. Brands include NARS, Tarte, HUDA BEAUTY, Estee Lauder, Laura Mercier, and Charlotte Tilbury for a luxurious HD glow.",
    includes: [
      "Waterproof base makeup",
      "Advanced & international hairstyling",
      "Luxury mink eyelashes",
      "Hair extensions",
      "Outfit draping",
      "Premium coloured lenses",
      "Hair accessories (fresh flowers)",
    ],
    notes: [
      "Booking is non-refundable and non-adjustable.",
      "No hair washing service is provided. Please arrive with clean, dry hair. Shampoo or hair washing is not included.",
    ],
    images: ["/hd/hd1.jpg", "/hd/hd2.jpg", "/hd/hd3.jpg", "/hd/hd4.jpg"],
    reverse: true,
  },
  {
    title: "Airbrush Bridal",
    price: "₹ 28,500",
    desc: "Silicon Base / Silk Makeup is designed to give you a super-natural, flawless, and skin-like finish. This signature makeover uses advanced airbrush base techniques that blend seamlessly into the skin, creating a lightweight yet long-lasting effect. The look enhances your natural features while ensuring a smooth, radiant complexion that stays fresh and camera-ready throughout your special occasion.",
    includes: [
      "Silicon Base makeup",
      "Advanced & international hairstyling",
      "Luxury mink eyelashes",
      "Hair extensions (if needed)",
      "Outfit draping",
      "Premium coloured lenses",
      "Hair accessories (fresh flowers)",
    ],
    notes: [
      "Booking is non-refundable and non-adjustable.",
      "No hair washing service is provided. Please arrive with clean, dry hair. Shampoo or hair washing is not included.",
    ],
    images: [
      "/airbrush/airbrush1.jpg",
      "/airbrush/airbrush2.jpg",
      "/airbrush/airbrush3.jpg",
      "/airbrush/airbrush4.jpg",
    ],
  },
];

const container = {
  show: {
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.18,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function BridalPage() {
  const pageRef = useRef(null);

  // Keep existing page-visible effect
  useEffect(() => {
    requestAnimationFrame(() => {
      pageRef.current?.classList.add("page-visible");
    });
  }, []);

  // Ensure body scroll is native (defensive)
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const openWhatsApp = (packageName, price) => {
    const message = `Hello Divisha Makeovers,
I am interested in your ${packageName}.

Package Price: ${price}

Please let me know availability and further details.`;
    window.open("https://wa.me/916280879548?text=" + encodeURIComponent(message), "_blank");
  };

  return (
    <div
      id="scroll-container"
      className="relative min-h-screen text-white overflow-x-hidden"
      style={{ overflowAnchor: "none" }}
    >
      <Navbar />

      {/* Fixed background - promoted to its own layer */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/bridal-bg/bridalbg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#2a0f14",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Overlay layers (decorative, pointer-events-none) */}
      <div className="fixed inset-0 z-10 bg-black/25 pointer-events-none" />
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background: "radial-gradient(700px at 20% 12%, rgba(255,215,230,0.20), rgba(0,0,0,0) 60%)",
        }}
      />
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0) 40%)",
        }}
      />

      <div className="pink-glow top-[25%] left-[8%] hidden md:block pointer-events-none" />
      <div className="pink-glow bottom-[12%] right-[6%] hidden md:block pointer-events-none" />

      {/* Main content */}
      <motion.div
        ref={pageRef}
        className="page-hidden relative z-20 min-h-screen px-6 md:px-10 pt-36 pb-20"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* HEADER */}
        <motion.div variants={item} className="max-w-6xl mx-auto mb-32 text-white">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition tracking-widest text-xs uppercase"
          >
            &larr; Back
          </button>

          <h1 className="text-5xl mb-4 tracking-wide leading-[1.1] text-white/95">Bridal Makeup</h1>

          <p className="text-white/70 leading-relaxed max-w-[90%]">
            Timeless, elegant bridal looks crafted to enhance your natural beauty and make you feel confident on
            your most special day.
          </p>
        </motion.div>

        {/* SECTIONS */}
        {bridalSections.map((section, idx) => (
          <motion.section key={idx} variants={item} className="max-w-7xl mx-auto mb-44">
            <div className="grid gap-16 items-center lg:grid-cols-[2.4fr_2.6fr]">
              {/* IMAGES */}
              <div
                className={`${section.reverse ? "lg:order-2 max-w-[900px]" : "lg:order-1 max-w-[700px]"
                  } w-full`}
              >
                  <div className="grid grid-cols-2 gap-4">
                    {section.images.map((img, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                        className="aspect-[3/4] max-h-[620px] overflow-hidden rounded-2xl bg-white/5 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.25)] relative"
                      >
                        <Image
                          src={img}
                          alt={section.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
              </div>

              {/* TEXT */}
              <div
                className={`${section.reverse ? "lg:order-1" : "lg:order-2"
                  } relative rounded-3xl bg-black/60 backdrop-blur-md p-10 border border-white/10`}
              >
                {/* BADGES */}
                {section.title === "Signature Highly Defined (HD) Bridal Package" && (
                  <div className="inline-block mb-4 px-4 py-1 rounded-full bg-pink-500/20 border border-pink-400 text-pink-300 text-xs tracking-widest uppercase font-semibold">
                    Best Seller
                  </div>
                )}

                {section.title === "Airbrush Bridal" && (
                  <div className="inline-block mb-5 px-5 py-1.5 rounded-full bg-[#C9A24D]/20 border border-[#E6C87A] text-[#E6C87A] text-xs tracking-[0.3em] uppercase font-semibold">
                    Luxury & Premium Package
                  </div>
                )}

                {/* TITLE */}
                <h2
                  className={`mb-4 tracking-wide ${section.title === "Airbrush Bridal"
                      ? "text-6xl"
                      : section.title === "Signature Highly Defined (HD) Bridal Package"
                        ? "text-5xl"
                        : "text-4xl"
                    }`}
                >
                  {section.title}
                </h2>

                <p className="text-white/70 leading-relaxed mb-6">{section.desc}</p>

                {section.title === "Airbrush Bridal" && (
                  <p className="text-white/60 italic text-sm mb-6">
                    Designed for brides who desire the finest and most exclusive bridal experience.
                  </p>
                )}

                {section.includes && (
                  <ul className="space-y-2 mb-8 text-white/75 text-sm">
                    {section.includes.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-pink-400">*</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* NOTES */}
                {section.notes && (
                  <div className="mt-8 p-5 rounded-2xl bg-white/10 border border-white/10">
                    <h4 className="text-xs tracking-widest uppercase text-white/60 mb-3">Important Notes</h4>

                    <ul className="space-y-2 text-white/60 text-sm">
                      {section.notes.map((note, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="text-pink-400">*</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* PRICE BLOCKS */}
                {section.title === "Signature Highly Defined (HD) Bridal Package" ? (
                  <div className="flex flex-wrap items-center gap-4 mb-8">
                    <p className="text-[#FF5CA8] text-3xl font-medium">{section.price}</p>

                    <div className="px-5 py-3 rounded-2xl bg-white/95 border border-[#FF7BBF] shadow-[0_6px_22px_rgba(255,92,168,0.12)] text-[#C2185B] text-[13px] font-semibold tracking-wide leading-tight">
                      <span className="block font-bold">FREE Bridal Nail Extensions </span>
                      <span className="block font-bold mt-2">FREE Basic Party Makeup </span>
                    </div>
                  </div>
                ) : section.title === "Airbrush Bridal" ? (
                  <p className="text-[#E6C87A] text-4xl font-medium mb-8">{section.price}</p>
                ) : (
                  <p className="text-pink-400 text-3xl mb-8">{section.price}</p>
                )}

                <button
                  onClick={() => openWhatsApp(section.title, section.price)}
                  className="inline-block bg-pink-500 px-8 py-3 rounded-full tracking-widest uppercase text-sm hover:bg-pink-600 transition-all duration-500"
                >
                  Book Now
                </button>
              </div>
            </div>
          </motion.section>
        ))}

        {/* FINAL CTA */}
        <motion.div variants={item} className="text-center">
          <h2 className="text-3xl mb-6 tracking-wide">Book Your Bridal Look</h2>

          <button
            onClick={() => openWhatsApp("Bridal Makeup Enquiry", "Discuss Packages")}
            className="inline-block bg-pink-500 px-10 py-4 rounded-full tracking-widest uppercase text-sm hover:bg-pink-600 transition-all duration-500"
          >
            Book on WhatsApp
          </button>
        </motion.div>
      </motion.div>

      {/* TRANSITION TO FOOTER */}
      <div className="relative z-20 h-40 bg-gradient-to-b from-transparent to-[#0b0b0c]" />

      {/* FOOTER */}
      <motion.footer
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="relative z-20"
      >
        <ClosingEditorial />
      </motion.footer>
    </div>
  );
}

