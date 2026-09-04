import type { ComponentType } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ChevronDown,
  Clock,
  Compass,
  FileText,
  Handshake,
  HardHat,
  LandPlot,
  LineChart,
  MessagesSquare,
  Monitor,
  MapPin,
  Menu,
  Moon,
  Palette,
  Pause,
  Phone,
  Play,
  Quote,
  Sun,
  Target,
  Telescope,
  TrendingUp,
  Wrench,
  X,
  type LucideProps,
} from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from "./brand-icons";

/**
 * A plain envelope — a rect with a folded-flap chevron, nothing more. Kept
 * as a hand-drawn glyph rather than lucide's `Mail` (which reads busier at
 * small sizes) because this simpler shape is the one the site has actually
 * shipped with.
 */
function EnvelopeIcon({
  size = 20,
  strokeWidth = 1.75,
  ...props
}: LucideProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export type IconName =
  | "arrow-right"
  | "architecture"
  | "moon"
  | "system"
  | "sun"
  | "target"
  | "telescope"
  | "palette"
  | "menu"
  | "close"
  | "quote"
  | "mail"
  | "phone"
  | "pin"
  | "play"
  | "pause"
  | "badge-check"
  | "chat"
  | "chevron-down"
  | "clock"
  | "facebook"
  | "instagram"
  | "linkedin"
  | "whatsapp"
  | "youtube"
  | "land-plot"
  | "development"
  | "handshake"
  | "valuation"
  | "advisory"
  | "facility"
  | "planning"
  | "legal";

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
  target: Target,
  telescope: Telescope,
  palette: Palette,
  menu: Menu,
  close: X,
  quote: Quote,
  mail: EnvelopeIcon,
  phone: Phone,
  pin: MapPin,
  play: Play,
  pause: Pause,
  "badge-check": BadgeCheck,
  chat: MessagesSquare,
  "chevron-down": ChevronDown,
  clock: Clock,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  whatsapp: WhatsAppIcon,
  youtube: YouTubeIcon,
  "land-plot": LandPlot,
  development: HardHat,
  handshake: Handshake,
  valuation: TrendingUp,
  advisory: LineChart,
  facility: Wrench,
  planning: Compass,
  legal: FileText,
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
