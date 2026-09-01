"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Reveal } from "./reveal";

export function MediaPageHero({
  lineOne,
  lineTwo,
}: {
  lineOne: string;
  lineTwo: string;
}) {
  return (
    <section className="relative m-2 h-[min(56vw,50rem)] min-h-[31rem] overflow-hidden rounded-[20px] bg-black">
      <Image
        src="/images/figma-pages/hero-building.png"
        alt="Dexta Africa property"
        fill
        priority
        className="object-cover"
      />
      <Image
        src="/images/figma-pages/hero-overlay.png"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/5" />
      <h1 className="absolute inset-x-5 top-[24%] text-[clamp(4rem,11.8vw,10.6rem)] leading-[.9] font-bold tracking-[-.045em] text-white md:inset-x-12">
        <span className="block">{lineOne}</span>
        <span className="mt-8 block text-right">{lineTwo}</span>
      </h1>
    </section>
  );
}
const questions = [
  "What is Dexta Africa Limited all about?",
  "Where are your estates located in Nigeria?",
  "Are your lands and properties verified and free from government acquisition?",
  "Can I buy land and pay in installments in Nigeria?",
  "What happens after I pay the initial deposit for land?",
];
export function CompactFaq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="grid gap-12 px-4 py-24 md:grid-cols-[34%_1fr] md:px-[4vw] md:py-28">
      <Reveal>
        <span className="rounded-full bg-[#f3f3f3] px-3 py-2 text-xs">FAQ</span>
        <h2 className="mt-4 text-6xl leading-[.9] font-medium text-black md:text-8xl">
          Got
          <br />
          <em className="font-serif font-medium">Questions?</em>
        </h2>
      </Reveal>
      <div>
        {questions.map((question, index) => (
          <div key={question} className="border-b border-[#dedede]">
            <button
              type="button"
              onClick={() => setOpen(open === index ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-medium md:text-xl"
            >
              <span>{question}</span>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f2f4f7]">
                {open === index ? "−" : "+"}
              </span>
            </button>
            {open === index && (
              <p className="max-w-3xl pb-6 leading-7 text-black/65">
                Dexta Africa is a forward-thinking real estate company focused
                on development, advisory and secure investment opportunities
                that create lasting value.
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
export function PropertyJourneyCta() {
  return (
    <section className="relative min-h-[43rem] overflow-hidden bg-black px-6 pt-16 text-center md:min-h-[58rem]">
      <Image
        src="/images/figma-pages/footer-city.png"
        alt=""
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/10 to-black" />
      <Reveal className="relative z-10 mx-auto max-w-4xl text-black">
        <h2 className="text-[clamp(3.3rem,6.7vw,6.2rem)] leading-none font-medium tracking-[-.035em]">
          Start Your{" "}
          <em className="font-serif font-medium">Property Journey</em> Today
        </h2>
        <Link
          href="/contact"
          className="mt-8 inline-flex items-center gap-7 rounded-lg bg-[#e81613] px-5 py-3 font-medium text-white"
        >
          Let’s Talk{" "}
          <span className="rounded bg-white px-2 py-1 text-black">→</span>
        </Link>
      </Reveal>
    </section>
  );
}
