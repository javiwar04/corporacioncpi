import type { Metadata } from "next";
import { projects } from "@/data";
import { executedProjects, proximosProjects } from "@/data/executed";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Explora los desarrollos inmobiliarios de Corporación CPI en un mapa interactivo: vivienda en Antigua Guatemala y bodegas industriales en Petén.",
};

export default function ProyectosPage() {
  return (
    <div className="bg-cream">
      <section className="border-b border-navy/8 bg-white">
        <div className="container-cpi py-14">
          <span className="kicker">Portafolio</span>
          <h1 className="mt-3 text-4xl font-medium text-navy sm:text-5xl">Nuestros proyectos</h1>
          <p className="mt-3 max-w-2xl text-navy/65">
            Ubica cada desarrollo en el mapa, revisa disponibilidad y entra al masterplan
            interactivo para elegir tu vivienda o bodega. Explora también nuestra obra ejecutada.
          </p>
        </div>
      </section>

      <section className="container-cpi py-10">
        <ProjectsExplorer projects={projects} executed={executedProjects} proximos={proximosProjects} />
      </section>
    </div>
  );
}
