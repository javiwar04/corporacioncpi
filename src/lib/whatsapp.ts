import { site } from "@/data/site";
import type { Project, PropertyUnit } from "@/data/types";

// Genera enlaces de WhatsApp con mensaje precompuesto. El mensaje NO incluye precio.

export function whatsappLink(message: string): string {
  const num = site.whatsappNumber;
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

export function unitWhatsappMessage(project: Project, unit: PropertyUnit): string {
  if (unit.whatsappMessage) return unit.whatsappMessage;
  const noun = project.category === "industrial" ? "la bodega" : "la vivienda";
  return `Hola, deseo recibir información sobre ${noun} ${unit.code} del proyecto ${project.name}.`;
}

export function unitWhatsappLink(project: Project, unit: PropertyUnit): string {
  return whatsappLink(unitWhatsappMessage(project, unit));
}

export function projectWhatsappLink(project: Project): string {
  return whatsappLink(
    `Hola, deseo recibir información sobre el proyecto ${project.name}.`
  );
}

export function generalWhatsappLink(): string {
  return whatsappLink(
    "Hola, me gustaría recibir información sobre los proyectos de Corporación CPI."
  );
}
