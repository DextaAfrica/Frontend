"use client";

import * as React from "react";
import Link from "next/link";
import { Button, Icon } from "@/components/ui";
import { browserEvents, browserStorage } from "@/config/browser-storage";
import { siteConfig } from "@/config/site";
import { submitChatLead } from "@/features/chat/api/submit-chat-lead";
import { readBrowserStorage, writeBrowserStorage } from "@/lib/browser-storage";
import { cn } from "@/lib/utils";

const PANEL_ID = "dexta-chat-panel";
const { contact, chat } = siteConfig;

const whatsappHref = `https://wa.me/${chat.whatsapp}?text=${encodeURIComponent(
  chat.greeting,
)}`;
const telHref = `tel:${contact.phone.replace(/[^\d+]/g, "")}`;
const mailHref = `mailto:${contact.email}`;

const quickReplies = [
  "I want to buy land",
  "Book an inspection",
  "Payment plans",
  "Speak to someone",
] as const;

type FormStatus = "idle" | "submitting" | "success" | "error";

/**
 * DexSmart Assistance — a floating concierge widget mounted once in the app
 * shell. The button sits bottom-right on every page (below the consent notice
 * and mobile nav in the stack), bounces in and — on a first visit — hops for
 * attention until the visitor comes near it. Opening it reveals a non-modal
 * panel: WhatsApp / call / email / inspection shortcuts and a short message
 * form that posts to `/api/chat-lead`. No AI yet — the structure leaves room
 * for an `/api/chat` mode later.
 */
export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [nudge, setNudge] = React.useState(false);
  const [status, setStatus] = React.useState<FormStatus>("idle");
  const [feedback, setFeedback] = React.useState("");

  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const messageRef = React.useRef<HTMLTextAreaElement>(null);

  const markSeen = React.useCallback(() => {
    setNudge(false);
    writeBrowserStorage(browserStorage.chat, "seen");
  }, []);

  // First-ever visit: a brief bounce + ping a few seconds in, then it settles.
  React.useEffect(() => {
    if (readBrowserStorage(browserStorage.chat)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = window.setTimeout(() => setNudge(true), 3200);
    const stop = window.setTimeout(() => setNudge(false), 15000);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(stop);
    };
  }, []);

  // Any CTA elsewhere can open the panel.
  React.useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      markSeen();
    };
    window.addEventListener(browserEvents.openChat, onOpen);
    return () => window.removeEventListener(browserEvents.openChat, onOpen);
  }, [markSeen]);

  // While open: move focus in, close on Esc / outside pointer.
  React.useEffect(() => {
    if (!open) return;
    panelRef.current
      ?.querySelector<HTMLElement>("[data-chat-autofocus]")
      ?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const toggle = () => {
    markSeen();
    setOpen((value) => !value);
  };

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  const applyQuickReply = (text: string) => {
    const field = messageRef.current;
    if (!field) return;
    field.value = field.value ? `${field.value}\n${text}` : text;
    field.focus();
  };

  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setFeedback("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      await submitChatLead({
        name: String(data.get("name") ?? ""),
        contact: String(data.get("contact") ?? ""),
        message: String(data.get("message") ?? ""),
        company: String(data.get("company") ?? ""),
      });
      form.reset();
      setStatus("success");
      setFeedback(
        "Thanks — we've got your message and will be in touch shortly.",
      );
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Your message could not be sent.",
      );
    }
  }

  return (
    <div
      onPointerEnter={nudge ? markSeen : undefined}
      className={cn(
        "chat-widget",
        open && "chat-widget--open",
        nudge && "chat-widget--nudge",
      )}
    >
      {open && (
        <div
          ref={panelRef}
          id={PANEL_ID}
          role="dialog"
          aria-label="DexSmart Assistance"
          className="chat-panel"
        >
          <header className="chat-panel__head">
            <div>
              <p className="chat-panel__title">DexSmart Assistance</p>
              <p className="chat-panel__meta">{chat.availability}</p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close DexSmart Assistance"
              className="chat-panel__close"
            >
              <Icon name="close" size={18} />
            </button>
          </header>

          <div className="chat-panel__body">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              data-chat-autofocus
              className="chat-action chat-action--wa"
            >
              <Icon name="whatsapp" size={18} className="chat-action__wa" />
              <span>Chat on WhatsApp</span>
              <Icon name="arrow-right" size={16} className="chat-action__go" />
            </a>

            <div className="chat-panel__row">
              <a href={telHref} className="chat-action chat-action--sm">
                <Icon name="phone" size={15} /> Call
              </a>
              <a href={mailHref} className="chat-action chat-action--sm">
                <Icon name="mail" size={15} /> Email
              </a>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="chat-action chat-action--sm"
              >
                <Icon name="badge-check" size={15} /> Inspect
              </Link>
            </div>

            <p className="chat-panel__label">Or send a message</p>
            <div className="chat-panel__chips">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => applyQuickReply(reply)}
                  className="chat-chip"
                >
                  {reply}
                </button>
              ))}
            </div>

            <form onSubmit={send} className="chat-form" noValidate>
              <input
                name="name"
                required
                placeholder="Your name"
                aria-label="Your name"
                autoComplete="name"
                className="chat-input"
              />
              <input
                name="contact"
                required
                placeholder="Email or phone number"
                aria-label="Email or phone number"
                className="chat-input"
              />
              <textarea
                ref={messageRef}
                name="message"
                required
                rows={3}
                placeholder="How can we help?"
                aria-label="Your message"
                className="chat-input chat-input--area"
              />
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="chat-form__hp"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Sending…" : "Send message"}
                <Icon name="arrow-right" />
              </Button>
              {feedback && (
                <p
                  role={status === "error" ? "alert" : "status"}
                  className={cn(
                    "chat-form__feedback",
                    status === "error" ? "text-destructive" : "text-success",
                  )}
                >
                  {feedback}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={open ? PANEL_ID : undefined}
        aria-label={
          open ? "Close DexSmart Assistance" : "Open DexSmart Assistance"
        }
        className="chat-launcher"
      >
        <span aria-hidden className="chat-launcher__ring" />
        <Icon name={open ? "close" : "whatsapp"} size={26} />
      </button>
    </div>
  );
}
