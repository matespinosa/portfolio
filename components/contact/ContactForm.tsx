"use client";

import { FormEvent, useRef, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const startedAt = useRef(Date.now());

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      subject: String(data.get("subject") ?? ""),
      message: String(data.get("message") ?? ""),
      company: String(data.get("company") ?? ""), // honeypot
      startedAt: startedAt.current,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok) {
        setStatus("error");
        setMessage(json.error ?? "No se pudo enviar. Intenta de nuevo.");
        return;
      }

      setStatus("success");
      setMessage("Mensaje enviado. Te responderé pronto.");
      form.reset();
      startedAt.current = Date.now();
    } catch {
      setStatus("error");
      setMessage("Error de red. Prueba el mailto como alternativa.");
    }
  }

  return (
    <form className="contact-form reveal is-visible" onSubmit={onSubmit} noValidate>
      {/* Honeypot — hidden from humans */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="contact-form__hp"
        aria-hidden="true"
      />

      <div className="contact-form__row">
        <label className="contact-form__field">
          <span>Nombre</span>
          <input name="name" type="text" required maxLength={80} placeholder="Tu nombre" />
        </label>
        <label className="contact-form__field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            required
            maxLength={120}
            placeholder="tu@email.com"
          />
        </label>
      </div>

      <label className="contact-form__field">
        <span>Asunto</span>
        <input
          name="subject"
          type="text"
          required
          maxLength={120}
          placeholder="¿De qué quieres hablar?"
        />
      </label>

      <label className="contact-form__field">
        <span>Mensaje</span>
        <textarea
          name="message"
          required
          rows={5}
          maxLength={4000}
          placeholder="Cuéntame sobre el proyecto, timeline y contexto."
        />
      </label>

      <button
        type="submit"
        className="btn btn--primary"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Enviando…" : "Enviar mensaje"}
      </button>

      {message ? (
        <p
          className={`contact-form__status contact-form__status--${status}`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
