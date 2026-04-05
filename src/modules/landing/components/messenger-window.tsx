"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EChatMessageProvider, EChatMessageRole } from "@common";
import { X } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useAtom } from "jotai";

import { Input, Textarea } from "@/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared";
import { createConversation, sendChatMessage } from "@/shared/apis/chat";
import {
  chatConversationIdAtom,
  chatIsStreamingAtom,
  chatMessagesAtom,
  chatStreamingContentAtom,
} from "@/shared/stores/chat.store";

import { LiquidGlass } from ".";

interface MessengerWindowProps {
  onClose: () => void;
}

function ChatTab() {
  const [conversationId, setConversationId] = useAtom(chatConversationIdAtom);
  const [messages, setMessages] = useAtom(chatMessagesAtom);
  const [isStreaming, setIsStreaming] = useAtom(chatIsStreamingAtom);
  const [streamingContent, setStreamingContent] = useAtom(chatStreamingContentAtom);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Bootstrap a conversation on first open
  useEffect(() => {
    if (!conversationId) {
      createConversation({}).then((res) => {
        setConversationId(res.conversation.id);
        // Seed with a welcome message (local only, not persisted)
        setMessages([
          {
            id: "welcome",
            conversationId: res.conversation.id,
            role: EChatMessageRole.ASSISTANT,
            content: "Hi! I'm SweetPix Support. How can I help you today?",
            provider: null,
            tokenCount: null,
            metadata: {},
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      });
    }
  }, [conversationId, setConversationId, setMessages]);

  // Scroll to bottom whenever messages or streaming content change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const handleSend = useCallback(async () => {
    const content = input.trim();
    if (!content || !conversationId || isStreaming) return;

    setInput("");
    setIsStreaming(true);
    setStreamingContent("");

    // Optimistically add user message
    const optimisticUserMsg = {
      id: `optimistic-${Date.now()}`,
      conversationId,
      role: EChatMessageRole.USER,
      content,
      provider: null,
      tokenCount: null,
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMessages((prev) => [...prev, optimisticUserMsg]);

    let accum = "";

    await sendChatMessage(
      conversationId,
      content,
      (token) => {
        accum += token;
        setStreamingContent(accum);
      },
      () => {
        // Finalize: append completed AI message
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            conversationId,
            role: EChatMessageRole.ASSISTANT,
            content: accum,
            provider: EChatMessageProvider.CLAUDE,
            tokenCount: null,
            metadata: {},
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
        setStreamingContent("");
        setIsStreaming(false);
      },
      () => {
        setStreamingContent("");
        setIsStreaming(false);
      }
    );
  }, [input, conversationId, isStreaming, setMessages, setIsStreaming, setStreamingContent]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                msg.role === "user" ? "bg-cyan-500/30 text-white" : "bg-white/10 text-white/80"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Streaming AI response */}
        {isStreaming && streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-xl bg-white/10 px-3 py-2 text-sm text-white/80">
              {streamingContent}
              <span className="ml-1 inline-block h-3 w-1 animate-pulse bg-white/60" />
            </div>
          </div>
        )}

        {/* Typing indicator (before first token arrives) */}
        {isStreaming && !streamingContent && (
          <div className="flex justify-start">
            <div className="flex gap-1 rounded-xl bg-white/10 px-3 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 border-t border-white/10 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ask me anything..."
          disabled={isStreaming}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-500/50 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={isStreaming || !input.trim()}
          className="rounded-xl bg-cyan-500/30 px-3 py-2 text-sm text-cyan-300 transition-colors hover:bg-cyan-500/40 disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  );
}

function ContactTab() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
          <span className="text-xl text-green-400">✓</span>
        </div>
        <p className="font-medium text-white">Message sent!</p>
        <p className="text-sm text-white/50">
          I&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-3"
    >
      <Input
        label="Name"
        placeholder="Your name"
        inputWrapperClassName="bg-white/5 border-white/10 rounded-xl"
        labelWrapperClassName="text-white/50"
        className="text-white/50"
        size="sm"
      />
      <Input
        label="Email"
        placeholder="your@email.com"
        inputWrapperClassName="bg-white/5 border-white/10 rounded-xl"
        labelWrapperClassName="text-white/50"
        className="text-white/50"
        size="sm"
        type="email"
      />
      <Textarea
        label="Message"
        placeholder="Your message..."
        textareaWrapperClassName="bg-white/5 border-white/10 rounded-xl"
        labelWrapperClassName="text-white/50"
        className="text-white/50"
        size="sm"
      />
      <button
        type="submit"
        className="w-full rounded-xl bg-cyan-500/30 py-2 text-sm font-medium text-cyan-300 transition-colors hover:bg-cyan-500/40"
      >
        Send Message
      </button>
    </form>
  );
}

export function MessengerWindow({ onClose }: MessengerWindowProps) {
  return (
    <motion.div
      layoutId="messenger-container"
      className="fixed right-6 bottom-6 z-50 h-[500px] w-[350px]"
    >
      <LiquidGlass
        blur="xl"
        glow
        className="flex h-full w-full flex-col overflow-hidden bg-black/60"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 p-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            <h3 className="font-semibold text-white">Send message</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/10"
            aria-label="Close chatbox"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="chat" className="flex min-h-0 flex-1 flex-col">
          <TabsList className="w-full shrink-0 rounded-none border-b border-white/10 bg-transparent">
            <TabsTrigger
              value="chat"
              className="flex-1 text-white/60 data-[state=active]:text-white"
            >
              Chat AI
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="flex-1 text-white/60 data-[state=active]:text-white"
            >
              Email Me
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="m-0 flex h-[calc(500px-130px)] flex-col">
            <ChatTab />
          </TabsContent>

          <TabsContent
            value="contact"
            className="m-0 h-[calc(500px-130px)] overflow-auto overscroll-contain p-4"
          >
            <ContactTab />
          </TabsContent>
        </Tabs>
      </LiquidGlass>
    </motion.div>
  );
}
