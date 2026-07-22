import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <div className="container-cpi grid min-h-[70vh] place-items-center text-center">
      <div>
        <p className="font-serif text-7xl font-semibold text-navy/15">404</p>
        <h1 className="mt-2 font-serif text-3xl font-medium text-navy">Página no encontrada</h1>
        <p className="mt-2 text-navy/60">La página que buscas no existe o fue movida.</p>
        <Link href="/" className="btn-primary mt-6">
          Volver al inicio <Icon name="arrow-right" size={18} />
        </Link>
      </div>
    </div>
  );
}
