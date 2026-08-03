"use client";

import * as React from "react";

const emptySubscribe = () => () => undefined;

export function useMounted() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
