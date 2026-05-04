"use client";

import { useState } from "react";
import PriceGateModal from "@/app/components/PriceGateModal";

const defaultBookButtonClass =
  "inline-block w-full sm:w-auto bg-pink-500 px-8 py-3 rounded-full tracking-widest uppercase text-sm hover:bg-pink-600 transition-all duration-500";

export default function GatedPriceAction({
  serviceName,
  packageName,
  price,
  onBook,
  revealedPrice,
  className = "",
  bookButtonClassName = defaultBookButtonClass,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPriceVisible, setIsPriceVisible] = useState(false);

  return (
    <>
      <div className={className}>
        {isPriceVisible ? (
          <>
            {revealedPrice || (
              <p className="mb-8 text-3xl text-pink-400">{price}</p>
            )}

            <button onClick={onBook} className={bookButtonClassName}>
              Book Now
            </button>
          </>
        ) : (
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.18)] sm:p-5">
            <p className="mb-3 text-xs uppercase tracking-[0.28em] text-white/45">
              Package price
            </p>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full rounded-full bg-pink-500 px-7 py-3 text-sm uppercase tracking-widest transition-all duration-500 hover:bg-pink-600 sm:w-auto"
            >
              View Price
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <PriceGateModal
          serviceName={serviceName}
          packageName={packageName}
          price={price}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsPriceVisible(true);
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
}
