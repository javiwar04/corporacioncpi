import { redirect } from "next/navigation";

// Proyectos y ejecutados ahora viven en una sola página (/proyectos).
export default function EjecutadosRedirect() {
  redirect("/proyectos");
}
