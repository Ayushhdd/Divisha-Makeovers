"use client";

import Image from "next/image";

export default function HeroBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-[#4a3034]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#4e3838] via-[#6e4248] to-[#351c20]" />
      <Image
        src="/image-hero/hero2.jpg"
        alt=""
        fill
        priority
        sizes="(max-width: 640px) 340vw, (max-width: 1024px) 240vw, 180vw"
        quality={92}
        className="
          object-cover
          md:object-center
          md:scale-100
          scale-[1.05]
          object-[75%_50%]
        "
      />

      {/* Same overlay you already liked */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
    </div>
  );
}
