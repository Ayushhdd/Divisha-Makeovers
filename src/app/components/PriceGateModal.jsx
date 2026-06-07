"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useLockedBodyScroll } from "@/app/hooks/useLockedBodyScroll";

export default function PriceGateModal({
  serviceName,
  packageName,
  price,
  onClose,
  onSuccess,
}) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    email: "",
    company: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useLockedBodyScroll(true);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/price-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          serviceName,
          packageName,
          price,
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || "Unable to show the price right now.");
      }

      onSuccess();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <motion.div
      data-floating-layer="true"
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="max-h-[calc(100svh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-white/15 bg-[#0b0b0c] p-6 text-white shadow-[0_28px_90px_rgba(0,0,0,0.55)] sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="price-gate-title"
      >
        <div className="mb-6">
          <p className="mb-2 text-xs uppercase tracking-[0.35em] text-pink-300">
            {serviceName}
          </p>

          <h2 id="price-gate-title" className="mb-3 text-2xl tracking-wide">
            View Package Price
          </h2>

          <p className="text-sm leading-relaxed text-white/60">
            Enter your details to view the package price instantly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="company"
            value={form.company}
            onChange={updateField}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <input
            name="name"
            value={form.name}
            onChange={updateField}
            required
            maxLength={80}
            placeholder="Name"
            className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-pink-300/70"
          />

          <input
            name="whatsapp"
            value={form.whatsapp}
            onChange={updateField}
            required
            type="tel"
            inputMode="tel"
            maxLength={18}
            placeholder="WhatsApp number"
            className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-pink-300/70"
          />

          <input
            name="email"
            value={form.email}
            onChange={updateField}
            type="email"
            maxLength={120}
            placeholder="Email (optional)"
            className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-pink-300/70"
          />

          <p className="text-xs leading-relaxed text-white/45">
            We will only use this to share booking details for this service.
          </p>

          {error && (
            <p className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-xs text-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-pink-500 py-3 text-sm uppercase tracking-widest transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Show Price"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-6 text-xs uppercase tracking-widest text-white/40 transition hover:text-white/70"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>,
    document.body
  );
}
