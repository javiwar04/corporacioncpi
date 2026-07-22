import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { executedProjects, getExecutedBySlug, executedGallery } from "@/data/executed";
import { site } from "@/data/site";
import { ObraDetail } from "@/components/projects/ObraDetail";

export function generateStaticParams() {
  return executedProjects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getExecutedBySlug(params.slug);
  if (!p) return {};
  return {
    title: `${p.name} · Ejecutado`,
    description: p.description ?? `${p.name} — proyecto ejecutado por Corporación CPI en ${p.location}.`,
    openGraph: {
      title: `${p.name} · ${site.name}`,
      description: p.description ?? "",
      images: [{ url: p.image }],
    },
  };
}

export default function EjecutadoDetailPage({ params }: { params: { slug: string } }) {
  const p = getExecutedBySlug(params.slug);
  if (!p) notFound();
  const gallery = executedGallery(p);
  return (
    <ObraDetail
      kind="ejecutado"
      name={p.name}
      location={p.location}
      description={p.description}
      details={p.details}
      cover={gallery[0] ?? p.image}
      gallery={gallery.length ? gallery : [p.image]}
    />
  );
}
