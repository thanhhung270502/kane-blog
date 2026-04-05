import type { ChatMessageObject } from "@common";
import { atom } from "jotai";

/** Whether the chat widget is open */
export const chatOpenAtom = atom<boolean>(false);

/** Active conversation id */
export const chatConversationIdAtom = atom<string | null>(null);

/** Messages in the active conversation */
export const chatMessagesAtom = atom<ChatMessageObject[]>([]);

/** Whether the AI is currently streaming a response */
export const chatIsStreamingAtom = atom<boolean>(false);

/** Partial AI response being assembled token-by-token during streaming */
export const chatStreamingContentAtom = atom<string>("");

/** Whether the conversation has been escalated to a human */
export const chatIsEscalatedAtom = atom<boolean>(false);

/** Name of the admin who took over, if any */
export const chatAdminNameAtom = atom<string | null>(null);
