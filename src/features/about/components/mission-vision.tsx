"use client";

import * as React from "react";
import { Section } from "@/components/layout";
import { RevealGroup, RevealItem } from "@/components/marketing";
import { Eyebrow, Icon, renderWithAccents } from "@/components/ui";
import type { IconName } from "@/components/ui";
import { gsap, useGSAP } from "@/lib/gsap";
import type { MissionVisionContent } from "../types/about-page";

const order = ["mission", "vision"] as const;

/**
 * Mission and vision, as a pair of editorial panels. Each carries a red icon
 * medallion, its label, and the statement set in the display face with an
 * italic accent phrase. No index number — the labels ("Our mission" / "Our
 * vision") already tell the two apart, so a "01"/"02" badge was only ever
 * noise. No photography either — the weight is all type and the brand red,
 * so the section never depends on an art asset that may not exist yet.
 *
 * Each panel unrolls open on scroll, rather than the site's usual blur-rise
 * alone (still there, wrapping the whole panel — see {@link RevealGroup}):
 * the icon expands open from a flattened line, a short red rule draws in
 * like the rod a scroll unrolls from, and the statement itself reveals
 * top-to-bottom through an animated `clip-path`, as if the panel is a
 * scroll being unrolled to read rather than a card fading into place.
 * `power3.inOut` on the clip specifically — a scroll unrolling moves at one
 * continuous, controlled pace, never overshoots and settles the way
 * `back.out` easing would.
 */
export function MissionVision({ content }: { content: MissionVisionContent }) {
  const rootRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      const panels = gsap.utils.toArray<HTMLElement>(
        rootRef.current?.querySelectorAll("[data-mv-panel]") ?? [],
      );

      panels.forEach((panel) => {
        const icon = panel.querySelector<HTMLElement>("[data-mv-icon]");
        const rod = panel.querySelector<HTMLElement>("[data-mv-rod]");
        const statement = panel.querySelector<HTMLElement>(
          "[data-mv-statement]",
        );

        const timeline = gsap.timeline({
          scrollTrigger: { trigger: panel, start: "top 78%", once: true },
        });

        if (icon) {
          timeline.fromTo(
            icon,
            { scaleY: 0, opacity: 0 },
            {
              scaleY: 1,
              opacity: 1,
              duration: 0.5,
              ease: "power3.out",
              transformOrigin: "50% 0%",
            },
          );
        }
        if (rod) {
          timeline.fromTo(
            rod,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.5,
              ease: "power2.out",
              transformOrigin: "0% 50%",
            },
            "-=0.2",
          );
        }
        if (statement) {
          timeline.fromTo(
            statement,
            { clipPath: "inset(0% 0% 100% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.9,
              ease: "power3.inOut",
            },
            "-=0.1",
          );
        }
      });
    },
    { scope: rootRef, dependencies: [content] },
  );

  return (
    <Section spacing="editorial" tone="surface">
      <div ref={rootRef}>
        <RevealGroup className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {order.map((key) => {
            const item = content[key];
            return (
              <RevealItem
                as="article"
                key={key}
                data-mv-panel
                className="mission-vision__panel"
              >
                <span aria-hidden data-mv-icon className="mission-vision__icon">
                  <Icon name={item.icon as IconName} size={26} />
                </span>
                <Eyebrow>{item.label}</Eyebrow>
                <span aria-hidden data-mv-rod className="mission-vision__rod" />
                <p data-mv-statement className="mission-vision__statement">
                  {renderWithAccents(item.text)}
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </Section>
  );
}
