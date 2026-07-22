import type { Amenity } from "@/data/types";
import { Icon, type IconName } from "@/components/ui/Icon";

const VALID: IconName[] = [
  "road", "shield", "pool", "building", "tree", "water", "bolt", "truck", "pin", "star",
];

export function Amenities({ amenities }: { amenities: Amenity[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {amenities.map((a) => {
        const icon = (VALID.includes(a.icon as IconName) ? a.icon : "star") as IconName;
        return (
          <div key={a.label} className="flex items-center gap-3 rounded-xl border border-navy/8 bg-white p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-cream text-gold-deep">
              <Icon name={icon} size={20} />
            </span>
            <div>
              <p className="text-sm font-medium text-navy">{a.label}</p>
              {a.description && <p className="text-xs text-navy/55">{a.description}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
