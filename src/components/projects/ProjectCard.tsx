import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/types";
import { projectCounters, categoryLabels, projectStatusLabels } from "@/data";
import { Icon } from "@/components/ui/Icon";
import { formatCurrency } from "@/lib/format";

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const counters = projectCounters(project);
  const from = project.units
    .filter((u) => u.price != null && u.priceConfirmed !== false)
    .sort((a, b) => (a.price ?? 0) - (b.price ?? 0))[0];

  return (
    <Link
      href={`/proyectos/${project.slug}`}
      className="group card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-float"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-navy/5">
        <Image
          src={project.coverImage}
          alt={`${project.name} — ${project.location}`}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-navy backdrop-blur">
            {categoryLabels[project.category]}
          </span>
          <span className="rounded-full bg-navy/85 px-2.5 py-1 text-[0.7rem] font-medium text-white backdrop-blur">
            {projectStatusLabels[project.status]}
          </span>
        </div>
        {project.preliminary && (
          <span className="absolute bottom-3 left-3 rounded-full bg-status-reserved/90 px-2.5 py-1 text-[0.68rem] font-medium text-white">
            Datos preliminares
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-xl font-medium text-navy">{project.name}</h3>
          <Icon name="arrow-right" size={18} className="mt-1 shrink-0 text-navy/30 transition-transform group-hover:translate-x-1 group-hover:text-gold" />
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-navy/55">
          <Icon name="pin" size={15} className="text-gold" /> {project.location}
        </p>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-navy/70">
          {project.shortDescription}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-navy/8 pt-4">
          <div>
            {from ? (
              <>
                <span className="text-[0.68rem] uppercase tracking-wide text-navy/45">Desde</span>
                <p className="font-serif text-lg font-semibold text-navy">
                  {formatCurrency(from.price, from.currency)}
                </p>
              </>
            ) : (
              <span className="text-sm font-medium text-navy/50">Consultar precio</span>
            )}
          </div>
          {counters.total > 1 && (
            <div className="text-right">
              <p className="font-serif text-lg font-semibold text-status-available">
                {counters.available}
                <span className="text-navy/40">/{counters.total}</span>
              </p>
              <span className="text-[0.68rem] uppercase tracking-wide text-navy/45">Disponibles</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
