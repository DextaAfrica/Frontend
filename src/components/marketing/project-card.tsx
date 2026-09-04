import Image from "next/image";
import { ButtonLink, Icon } from "@/components/ui";
import { isRemoteAsset } from "@/lib/media";
import { Reveal } from "./reveal";

export interface Project {
  slug: string;
  name: string;
  location: string;
  status: string;
  description: string;
  tone: "ruby" | "stone" | "dusk" | "light";
  image?: string;
  /** A short marketing line for the detail page's hero; falls back to a
   *  generic one when a project doesn't have real campaign copy yet. */
  tagline?: string;
  /** e.g. "Starting from ₦15M initial deposit" — only ever real, supplied
   *  figures, never invented to fill the slot. */
  priceFrom?: string;
  /** Headline selling points, shown as a facts strip on the detail page. */
  features?: readonly string[];
  /** The detail page's hero background. Falls back to `image` when unset —
   *  most projects only have the one photo today. */
  heroImage?: string;
  /** `object-position` override for `heroImage` — see `HeroVideoProps.position`.
   *  Leave unset for a photo with room to spare on both axes; only needed
   *  when the hero's subject sits close to an edge for a centred crop. */
  heroImagePosition?: string;
  /** The detail page's product-listing-style photo galleries, grouped the
   *  way a real estate listing actually groups finishes — interior and
   *  exterior are two separate sets a visitor switches between, not one
   *  undifferentiated pile of photos. Either (or both) may be empty while
   *  a project's photo set is still being put together. */
  interiorGallery?: readonly { src: string; alt: string }[];
  exteriorGallery?: readonly { src: string; alt: string }[];
}

/**
 * The `/projects` collection card — a full-bleed photo card with the copy
 * painted directly onto it under a scrim, not a photo-then-text-below
 * layout. Same language the homepage's own mobile project carousel already
 * uses (glass status chip, on-media type, a red arrow-CTA that steps
 * forward on hover) rather than a third, different card style — reused
 * deliberately so the two collections read as one considered system.
 */
export function ProjectCard({ project }: { project: Project }) {
  const href = `/projects/${project.slug}`;
  return (
    <Reveal>
      <article className="project-collection-card group">
        {project.image && (
          <Image
            src={project.image}
            alt={`${project.name}, ${project.location}`}
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            unoptimized={isRemoteAsset(project.image)}
            className="project-collection-card__img"
          />
        )}
        <span aria-hidden className="project-collection-card__scrim" />

        <span className="project-badge project-collection-card__badge">
          <Icon name="badge-check" size={12} />
          {project.status}
        </span>

        <div className="project-collection-card__body">
          <h3 className="project-collection-card__name">{project.name}</h3>
          <p className="project-collection-card__location">
            <Icon name="pin" size={13} />
            {project.location}
          </p>
          <p className="project-collection-card__desc">{project.description}</p>
          <ButtonLink
            href={href}
            size="sm"
            className="project-collection-card__cta"
            aria-label={`View ${project.name}`}
          >
            View residence
            <Icon name="arrow-right" />
          </ButtonLink>
        </div>
      </article>
    </Reveal>
  );
}
