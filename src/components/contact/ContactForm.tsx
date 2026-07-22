"use client";

import { useState } from "react";
import { site } from "@/data/site";
import { whatsappLink } from "@/lib/whatsapp";
import { Icon } from "@/components/ui/Icon";

// Formulario de "Solicitar información".
// Sin backend: compone un mensaje y lo envía por WhatsApp (canal confirmado de CPI).
// Si se define NEXT_PUBLIC_LEADS_ENDPOINT, hace POST allí en su lugar.
export function ContactForm({ context }: { context?: string }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const endpoint = process.env.NEXT_PUBLIC_LEADS_ENDPOINT;

  return (
    <form
      className="grid gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const nombre = String(fd.get("nombre") || "");
        const telefono = String(fd.get("telefono") || "");
        const email = String(fd.get("email") || "");
        const mensaje = String(fd.get("mensaje") || "");

        const composed =
          `Hola, soy ${nombre}.` +
          (context ? ` Me interesa ${context}.` : "") +
          (mensaje ? ` ${mensaje}` : "") +
          (telefono ? ` Tel: ${telefono}.` : "") +
          (email ? ` Correo: ${email}.` : "");

        if (endpoint) {
          setLoading(true);
          try {
            await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ nombre, telefono, email, mensaje, context }),
            });
            setSent(true);
          } catch {
            window.open(whatsappLink(composed), "_blank");
          } finally {
            setLoading(false);
          }
        } else {
          window.open(whatsappLink(composed), "_blank");
          setSent(true);
        }
      }}
    >
      {context && (
        <p className="rounded-lg bg-cream px-3 py-2 text-sm text-navy/70">
          Consulta sobre: <strong className="text-navy">{context}</strong>
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <input required name="nombre" placeholder="Nombre completo" className="rounded-lg border border-navy/12 bg-white px-4 py-2.5 text-sm outline-none focus:border-gold" />
        <input required name="telefono" placeholder="Teléfono / WhatsApp" className="rounded-lg border border-navy/12 bg-white px-4 py-2.5 text-sm outline-none focus:border-gold" />
      </div>
      <input type="email" name="email" placeholder="Correo electrónico (opcional)" className="rounded-lg border border-navy/12 bg-white px-4 py-2.5 text-sm outline-none focus:border-gold" />
      <textarea name="mensaje" rows={4} placeholder="¿En qué podemos ayudarte?" className="rounded-lg border border-navy/12 bg-white px-4 py-2.5 text-sm outline-none focus:border-gold" />

      <button type="submit" disabled={loading} className="btn-primary justify-center">
        {loading ? "Enviando…" : (<><Icon name="whatsapp" size={18} /> Enviar solicitud</>)}
      </button>

      {sent && (
        <p className="rounded-lg bg-status-available/10 px-3 py-2 text-sm text-status-available">
          ¡Gracias! Se abrió WhatsApp con tu mensaje. Si no, escríbenos al {site.phone}.
        </p>
      )}
      <p className="text-xs text-navy/45">
        Al enviar, se abrirá WhatsApp con tu mensaje listo para enviar a Corporación CPI.
      </p>
    </form>
  );
}
