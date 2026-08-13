"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "./Reveal";
import { WhatsAppIcon } from "./Hero";
import { useLang } from "./LanguageContext";
import { formatPrice } from "@/lib/format";
import type { TourDTO } from "@/lib/types";

const TIME_SLOTS = ["09:00", "11:00", "14:00", "16:00"];

export function BookingSection({
  tours,
  selectedTourId,
  whatsappNumber,
}: {
  tours: TourDTO[];
  selectedTourId: string;
  whatsappNumber: string;
}) {
  const { t, lang } = useLang();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    tourId: selectedTourId || tours[0]?.id || "",
    name: "",
    email: "",
    phone: "",
    language: lang,
    date: "",
    timeSlot: TIME_SLOTS[0],
    people: 2,
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [waLink, setWaLink] = useState("");

  useEffect(() => {
    if (selectedTourId) setForm((f) => ({ ...f, tourId: selectedTourId }));
  }, [selectedTourId]);

  useEffect(() => {
    setForm((f) => ({ ...f, language: lang }));
  }, [lang]);

  const selectedTour = tours.find((x) => x.id === form.tourId);

  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.tourId || !form.name || !form.email || !form.phone || !form.date) {
      setError(t.booking.errorRequired);
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "error");
      setWaLink(data.whatsappUrl);
      setStatus("success");
      if (data.whatsappUrl) window.open(data.whatsappUrl, "_blank");
    } catch {
      setStatus("error");
      setError(t.booking.errorGeneric);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-marea-400/20 bg-marea-900/50 px-4 py-3 text-white placeholder-marea-400 outline-none transition-colors focus:border-marea-400";

  return (
    <section id="book" className="relative overflow-hidden py-24">
      <div className="aurora absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-3xl px-5">
        <Reveal className="text-center">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">{t.booking.title}</h2>
          <p className="mt-3 text-marea-300">{t.booking.subtitle}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass mt-10 rounded-3xl p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-3xl text-white">
                    ✓
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-bold text-white">{t.booking.successTitle}</h3>
                  <p className="mx-auto mt-3 max-w-md text-marea-200">{t.booking.successMsg}</p>
                  <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                    {waLink && (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-glow flex items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-3 font-semibold text-white"
                      >
                        <WhatsAppIcon className="h-5 w-5" /> {t.booking.openWhatsapp}
                      </a>
                    )}
                    <button
                      onClick={() => setStatus("idle")}
                      className="rounded-full border border-marea-400/30 px-6 py-3 font-semibold text-marea-100 hover:bg-marea-800/50"
                    >
                      {t.booking.newBooking}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={submit}
                  className="grid gap-4 sm:grid-cols-2"
                >
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm text-marea-300">{t.booking.tour}</label>
                    <select value={form.tourId} onChange={(e) => set("tourId", e.target.value)} className={inputClass}>
                      <option value="" disabled>
                        {t.booking.selectTour}
                      </option>
                      {tours.map((tour) => (
                        <option key={tour.id} value={tour.id}>
                          {(lang === "es" ? tour.titleEs : tour.titleEn)} —{" "}
                          {tour.price === 0 ? t.tours.free : formatPrice(tour.price, tour.currency, lang)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm text-marea-300">{t.booking.name} *</label>
                    <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-marea-300">{t.booking.phone} *</label>
                    <input
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="+57 300 000 0000"
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm text-marea-300">{t.booking.email} *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm text-marea-300">{t.booking.date} *</label>
                    <input
                      type="date"
                      min={today}
                      value={form.date}
                      onChange={(e) => set("date", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-marea-300">{t.booking.time}</label>
                    <select value={form.timeSlot} onChange={(e) => set("timeSlot", e.target.value)} className={inputClass}>
                      {TIME_SLOTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm text-marea-300">{t.booking.language}</label>
                    <select value={form.language} onChange={(e) => set("language", e.target.value)} className={inputClass}>
                      <option value="es">{t.booking.spanish}</option>
                      <option value="en">{t.booking.english}</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-marea-300">{t.booking.people}</label>
                    <input
                      type="number"
                      min={1}
                      max={selectedTour?.maxPeople ?? 20}
                      value={form.people}
                      onChange={(e) => set("people", Math.max(1, parseInt(e.target.value) || 1))}
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm text-marea-300">{t.booking.notes}</label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => set("notes", e.target.value)}
                      placeholder={t.booking.notesPlaceholder}
                      rows={2}
                      className={inputClass}
                    />
                  </div>

                  {selectedTour && (
                    <div className="sm:col-span-2 flex items-center justify-between rounded-xl bg-marea-900/50 px-4 py-3 text-sm">
                      <span className="text-marea-300">{lang === "es" ? selectedTour.titleEs : selectedTour.titleEn}</span>
                      <span className="font-bold text-white">
                        {selectedTour.price === 0
                          ? t.tours.free
                          : formatPrice(selectedTour.price * form.people, selectedTour.currency, lang)}
                      </span>
                    </div>
                  )}

                  {error && <p className="sm:col-span-2 text-sm text-red-400">{error}</p>}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="btn-glow sm:col-span-2 mt-2 rounded-full bg-gradient-to-r from-marea-400 to-marea-700 py-3.5 font-semibold text-white disabled:opacity-60"
                  >
                    {status === "loading" ? t.booking.submitting : t.booking.submit}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
