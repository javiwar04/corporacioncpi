import { Icon } from "@/components/ui/Icon";
import { generalWhatsappLink } from "@/lib/whatsapp";

export function WhatsAppFab() {
  return (
    <a
      href={generalWhatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-float transition-transform hover:scale-105"
    >
      <Icon name="whatsapp" size={28} />
    </a>
  );
}
