import type { ComponentType } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ChevronDown,
  Clock,
  Monitor,
  Mail,
  MapPin,
  Menu,
  Moon,
  Palette,
  Phone,
  Play,
  Quote,
  Sun,
  X,
  type LucideProps,
} from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
} from "./brand-icons";

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
  | "pin"
  | "play"
  | "badge-check"
  | "chevron-down"
  | "clock"
  | "facebook"
  | "instagram"
  | "linkedin"
  | "youtube";

export interface IconProps extends LucideProps {
  name: IconName;
}

/**
 * The subset of props `Icon` forwards to a glyph. Both `lucide-react` icons and
 * the local brand SVGs in `./brand-icons` satisfy this shape.
 */
type GlyphProps = {
  size?: number | string;
  strokeWidth?: number | string;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
};

const icons: Record<IconName, ComponentType<GlyphProps>> = {
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
  play: Play,
  "badge-check": BadgeCheck,
  "chevron-down": ChevronDown,
  clock: Clock,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  youtube: YouTubeIcon,
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
