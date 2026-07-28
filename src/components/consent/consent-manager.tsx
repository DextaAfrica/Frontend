"use client";

import * as React from "react";
import { Cluster, Stack } from "@/components/layout";
import { Button, Modal } from "@/components/ui";

const STORAGE_KEY = "maison-rouge-consent";
const CHANGE_EVENT = "maison-consent-change";
const OPEN_EVENT = "maison-open-cookie-settings";
type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
function hasSavedConsent() {
  return localStorage.getItem(STORAGE_KEY) !== null;
}
function saveConsent(analytics: boolean, marketing: boolean) {
  const consent: Consent = {
    necessary: true,
    analytics,
    marketing,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
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
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const consent = JSON.parse(saved) as Consent;
        setAnalytics(consent.analytics);
        setMarketing(consent.marketing);
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
          className="fixed inset-x-3 bottom-3 z-[80] border border-border bg-background p-5 text-foreground shadow-2xl sm:right-5 sm:bottom-5 sm:left-auto sm:max-w-xl sm:p-6"
        >
          <Stack gap="md">
            <Stack gap="xs">
              <h2 className="text-lg font-medium">
                Your privacy, your choice.
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
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
