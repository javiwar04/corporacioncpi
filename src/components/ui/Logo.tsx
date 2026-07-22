import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

// Logotipo Corporación CPI.
// - variant "dark" (fondos claros, p. ej. navbar): usa el logo oficial (PNG transparente).
// - variant "light" (fondos oscuros, p. ej. footer): recreación en blanco (el logo oficial
//   mezcla navy + blanco y no se invierte limpio sobre fondo oscuro).
export function Logo({
  variant = "dark",
  withWordmark = true,
  className,
}: {
  variant?: "dark" | "light";
  withWordmark?: boolean;
  className?: string;
}) {
  if (variant === "dark") {
    return (
      <Link href="/" aria-label="Corporación CPI — Inicio" className={clsx("inline-flex items-center", className)}>
        <Image
          src="/brand/logosinfondocpi.png"
          alt="Corporación CPI"
          width={420}
          height={187}
          priority
          className="h-10 w-auto"
        />
      </Link>
    );
  }

  const ink = "#FFFFFF";
  const sub = "rgba(255,255,255,0.72)";
  return (
    <Link href="/" aria-label="Corporación CPI — Inicio" className={clsx("inline-flex items-center", className)}>
      <span className="inline-flex items-center gap-2">
        <span
          className="grid h-9 w-9 place-items-center rounded-[5px] font-serif text-lg font-semibold"
          style={{ background: ink, color: "#08053E" }}
          aria-hidden
        >
          C
        </span>
        <span className="leading-none">
          <span className="block font-serif text-xl font-semibold tracking-[0.14em]" style={{ color: ink }}>
            CPI
          </span>
          {withWordmark && (
            <span className="block text-[0.55rem] font-medium uppercase tracking-[0.34em]" style={{ color: sub }}>
              Corporación
            </span>
          )}
        </span>
      </span>
    </Link>
  );
}
