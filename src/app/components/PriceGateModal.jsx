"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useLockedBodyScroll } from "@/app/hooks/useLockedBodyScroll";
import {
  getIndianMobileError,
  getNameError,
  normalizeIndianMobile,
} from "@/app/lib/priceLeadValidation";

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
    confirmedWhatsApp: false,
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
    const { checked, name, type, value } = event.target;
    const nextValue =
      type === "checkbox"
        ? checked
        : name === "whatsapp"
          ? normalizeIndianMobile(value)
          : value;

    setForm((current) => ({ ...current, [name]: nextValue }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const nameError = getNameError(form.name);
    const whatsappError = getIndianMobileError(form.whatsapp);

    if (nameError || whatsappError || !form.confirmedWhatsApp) {
      setError(
        nameError ||
          whatsappError ||
          "Please confirm that this is your active WhatsApp number."
      );
      return;
    }

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

      window.gtag?.("event", "package_price_unlocked", {
        service_name: serviceName,
        package_name: packageName,
      });
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
            minLength={2}
            maxLength={80}
            autoComplete="name"
            placeholder="Your real name"
            className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-pink-300/70"
          />

          <input
            name="whatsapp"
            value={form.whatsapp}
            onChange={updateField}
            required
            type="tel"
            inputMode="numeric"
            minLength={10}
            maxLength={10}
            autoComplete="tel"
            placeholder="10-digit WhatsApp number"
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

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs leading-relaxed text-white/65">
            <input
              name="confirmedWhatsApp"
              checked={form.confirmedWhatsApp}
              onChange={updateField}
              required
              type="checkbox"
              className="mt-0.5 size-4 accent-pink-500"
            />
            <span>
              This is my active WhatsApp number and Divisha Makeovers may
              contact me about this package.
            </span>
          </label>

          <p className="text-xs leading-relaxed text-white/45">
            Incorrect or temporary details will not unlock the package price.
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
