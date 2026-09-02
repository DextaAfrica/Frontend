"use client";

import * as React from "react";
import { browserEvents, browserStorage } from "@/config/browser-storage";
import { Cluster, Stack } from "@/components/layout";
import { Button, Modal } from "@/components/ui";
import {
  readBrowserStorage,
  removeBrowserStorage,
  writeBrowserStorage,
} from "@/lib/browser-storage";

const STORAGE_KEY = browserStorage.consent;
const CHANGE_EVENT = browserEvents.consentChanged;
const OPEN_EVENT = browserEvents.openCookieSettings;
type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

function parseConsent(value: string | null): Consent | null {
  if (!value) return null;
  try {
    const consent: unknown = JSON.parse(value);
    if (
      typeof consent !== "object" ||
      consent === null ||
      !("necessary" in consent) ||
      consent.necessary !== true ||
      !("analytics" in consent) ||
      typeof consent.analytics !== "boolean" ||
      !("marketing" in consent) ||
      typeof consent.marketing !== "boolean" ||
      !("updatedAt" in consent) ||
      typeof consent.updatedAt !== "string"
    ) {
      return null;
    }
    return consent as Consent;
  } catch {
    return null;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
function hasSavedConsent() {
  return parseConsent(readBrowserStorage(STORAGE_KEY)) !== null;
}
function saveConsent(analytics: boolean, marketing: boolean) {
  const consent: Consent = {
    necessary: true,
    analytics,
    marketing,
    updatedAt: new Date().toISOString(),
  };
  writeBrowserStorage(STORAGE_KEY, JSON.stringify(consent));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function ConsentManager() {
  const consentSaved = React.useSyncExternalStore(
    subscribe,
    hasSavedConsent,
    () => true,
  );
  const [preferencesOpen, setPreferencesOpen] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(false);
  const [marketing, setMarketing] = React.useState(false);
  React.useEffect(() => {
    function openPreferences() {
      const consent = parseConsent(readBrowserStorage(STORAGE_KEY));
      if (consent) {
        setAnalytics(consent.analytics);
        setMarketing(consent.marketing);
      } else {
        removeBrowserStorage(STORAGE_KEY);
      }
      setPreferencesOpen(true);
    }
    window.addEventListener(OPEN_EVENT, openPreferences);
    return () => window.removeEventListener(OPEN_EVENT, openPreferences);
  }, []);
  function commit(nextAnalytics: boolean, nextMarketing: boolean) {
    saveConsent(nextAnalytics, nextMarketing);
    setPreferencesOpen(false);
  }

  return (
    <>
      {!consentSaved && (
        <aside
          aria-label="Cookie consent"
          className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[var(--layer-notice)] border border-border bg-surface-elevated p-5 text-foreground shadow-2xl sm:right-5 sm:bottom-[max(1.25rem,env(safe-area-inset-bottom))] sm:left-auto sm:max-w-xl sm:p-6"
        >
          <Stack gap="md">
            <Stack gap="xs">
              <h2 className="text-lg font-medium">
                Your privacy, your choice.
              </h2>
              <p className="text-sm leading-5 text-muted-foreground">
                We use essential cookies to operate this website. With your
                permission, optional analytics and marketing cookies help us
                understand and improve the experience.
              </p>
            </Stack>
            <Cluster>
              <Button onClick={() => commit(true, true)}>Accept all</Button>
              <Button variant="secondary" onClick={() => commit(false, false)}>
                Essential only
              </Button>
              <Button variant="ghost" onClick={() => setPreferencesOpen(true)}>
                Manage preferences
              </Button>
            </Cluster>
          </Stack>
        </aside>
      )}
      <Modal
        open={preferencesOpen}
        onClose={() => setPreferencesOpen(false)}
        title="Cookie preferences"
        description="Choose which optional technologies may be used on this device."
      >
        <Stack gap="md">
          <ConsentOption
            title="Essential"
            description="Required for security, navigation, theme, and consent storage."
            checked
            disabled
          />
          <ConsentOption
            title="Analytics"
            description="Helps us understand aggregate website usage and performance."
            checked={analytics}
            onChange={setAnalytics}
          />
          <ConsentOption
            title="Marketing"
            description="Allows more relevant campaign measurement and communication."
            checked={marketing}
            onChange={setMarketing}
          />
          <Cluster>
            <Button onClick={() => commit(analytics, marketing)}>
              Save preferences
            </Button>
            <Button variant="secondary" onClick={() => commit(false, false)}>
              Reject optional
            </Button>
          </Cluster>
        </Stack>
      </Modal>
    </>
  );
}

function ConsentOption({
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-5 border border-border p-4">
      <span>
        <span className="block text-sm font-medium">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
          {description}
        </span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
        className="mt-1 size-4 accent-primary"
      />
    </label>
  );
}

export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
    >
      Cookie settings
    </button>
  );
}
