"use client";

import { useCallback, useEffect, useState } from "react";
import { createIdentity, readIdentity, clearIdentity, type Identity } from "@/lib/identity";
import type { AvatarConfig } from "@/lib/avatar";

export interface UseIdentity {
  identity: Identity | null;
  ready: boolean; // localStorage has been read (avoids SSR/hydration flash)
  create: (name: string, avatar: AvatarConfig) => Identity;
  reset: () => void;
}

export function useIdentity(): UseIdentity {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIdentity(readIdentity());
    setReady(true);
  }, []);

  const create = useCallback((name: string, avatar: AvatarConfig) => {
    const next = createIdentity(name, avatar);
    setIdentity(next);
    return next;
  }, []);

  const reset = useCallback(() => {
    clearIdentity();
    setIdentity(null);
  }, []);

  return { identity, ready, create, reset };
}
