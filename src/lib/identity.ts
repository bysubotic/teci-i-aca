import type { AvatarConfig } from "./avatar";
import { DEFAULT_AVATAR } from "./avatar";

// Visitor identity stored in localStorage. There are no real accounts — the
// `id` is just a stable per-device key used for likes and prediction upserts.
// `avatar` is the little character the visitor builds when they enter.

export interface Identity {
  id: string;
  name: string;
  avatar: AvatarConfig;
}

const STORAGE_KEY = "babyhub.identity";

function isAvatar(value: unknown): value is AvatarConfig {
  if (!value || typeof value !== "object") return false;
  const a = value as Record<string, unknown>;
  return typeof a.animal === "string" && typeof a.bg === "string";
}

export function readIdentity(): Identity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Identity>;
    if (parsed && typeof parsed.id === "string" && typeof parsed.name === "string") {
      return {
        id: parsed.id,
        name: parsed.name,
        avatar: isAvatar(parsed.avatar) ? parsed.avatar : DEFAULT_AVATAR,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function createIdentity(name: string, avatar: AvatarConfig): Identity {
  const identity: Identity = { id: crypto.randomUUID(), name: name.trim(), avatar };
  saveIdentity(identity);
  return identity;
}

export function saveIdentity(identity: Identity): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
}

export function clearIdentity(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
