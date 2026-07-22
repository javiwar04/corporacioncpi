import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { proximosProjects, getProximoBySlug, proximoGallery } from "@/data/executed";
import { site } from "@/data/site";
import { ObraDetail } from "@/components/projects/ObraDetail";

export function generateStaticParams() {
  return proximosProjects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProximoBySlug(params.slug);
  if (!p) return {};
  return {
    title: `${p.name} · Próximo proyecto`,
    description: p.description ?? `${p.name} — próximo proyecto de Corporación CPI en ${p.location}.`,
    openGraph: {
      title: `${p.name} · ${site.name}`,
      description: p.description ?? "",
      images: [{ url: p.image }],
    },
  };
}

export default function ProximoDetailPage({ params }: { params: { slug: string } }) {
  const p = getProximoBySlug(params.slug);
  if (!p) notFound();
  const gallery = proximoGallery(p);
  return (
    <ObraDetail
      kind="proximo"
      name={p.name}
      location={p.location}
      description={p.description}
      details={p.details}
      status={p.status}
      cover={gallery[0] ?? p.image}
      gallery={gallery.length ? gallery : [p.image]}
    />
  );
}
