import { redirect } from "next/navigation";

// Nosotros y Contacto ahora viven en una sola página (/contacto).
export default function NosotrosRedirect() {
  redirect("/contacto");
}
