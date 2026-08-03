"use client";

import * as React from "react";
import { motion, type Transition, type Variants } from "motion/react";

const revealTransition: Transition = {
  duration: 0.42,
  ease: [0.22, 1, 0.36, 1],
};

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const revealTags = {
  div: motion.div,
  figure: motion.figure,
  article: motion.article,
  span: motion.span,
  li: motion.li,
} as const;

type RevealTag = keyof typeof revealTags;
type MotionDivProps = React.ComponentProps<typeof motion.div>;

export interface RevealProps extends MotionDivProps {
  delay?: number;
  as?: RevealTag;
}

/** Fades and slides an element in the first time it enters the viewport. */
export function Reveal({
  as = "div",
  delay = 0,
  transition,
  ...props
}: RevealProps) {
  const MotionTag = revealTags[as] as typeof motion.div;
  return (
    <MotionTag
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ ...revealTransition, delay, ...transition }}
      {...props}
    />
  );
}

export interface RevealGroupProps extends MotionDivProps {
  /** Seconds between each child's reveal. */
  stagger?: number;
}

/** Reveals its RevealItem children in sequence as the group enters the viewport. */
export function RevealGroup({
  stagger = 0.12,
  transition,
  ...props
}: RevealGroupProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ staggerChildren: stagger, ...transition }}
      {...props}
    />
  );
}

export interface RevealItemProps extends MotionDivProps {
  as?: RevealTag;
}

/** A single staggered child of RevealGroup. Must be a direct child. */
export function RevealItem({
  as = "div",
  transition,
  ...props
}: RevealItemProps) {
  const MotionTag = revealTags[as] as typeof motion.div;
  return (
    <MotionTag
      variants={revealVariants}
      transition={{ ...revealTransition, ...transition }}
      {...props}
    />
  );
}
