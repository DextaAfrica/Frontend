import {
  ArrowRight,
  Building2,
  Monitor,
  Mail,
  MapPin,
  Menu,
  Moon,
  Palette,
  Phone,
  Quote,
  Sun,
  X,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

export type IconName =
  | "arrow-right"
  | "architecture"
  | "moon"
  | "system"
  | "sun"
  | "palette"
  | "menu"
  | "close"
  | "quote"
  | "mail"
  | "phone"
  | "pin";

export interface IconProps extends LucideProps {
  name: IconName;
}

const icons: Record<IconName, LucideIcon> = {
  "arrow-right": ArrowRight,
  architecture: Building2,
  moon: Moon,
  system: Monitor,
  sun: Sun,
  palette: Palette,
  menu: Menu,
  close: X,
  quote: Quote,
  mail: Mail,
  phone: Phone,
  pin: MapPin,
};

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.75,
  ...props
}: IconProps) {
  const Component = icons[name];

  return (
    <Component
      aria-hidden="true"
      size={size}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}
