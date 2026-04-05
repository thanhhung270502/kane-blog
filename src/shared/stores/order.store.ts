import { atom } from "jotai";

/** Storage key for persisting the active order ID across sessions. */
export const ORDER_ID_STORAGE_KEY = "photos_order_id";

/** Active order ID — persisted to localStorage so users can resume their session. */
export const orderIdAtom = atom<string | null>(null);
