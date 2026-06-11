import { useEffect, useRef, useState } from "react";
import { Form, useFetcher } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { useAuth } from "~/modules/authentication";
import { useAuraChat } from "~/aura/hooks/use-chat";
import { Button } from "~/components/ui/button";

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 px-4">
      <div
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ background: "linear-gradient(135deg, #9B59B6, #E91E8C)" }}
      >
        A
      </div>
      <div
        className="flex gap-1.5 rounded-2xl rounded-bl-sm px-4 py-3"
        style={{ backgroundColor: "rgba(155, 89, 182, 0.15)", border: "1px solid rgba(155, 89, 182, 0.2)" }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-2 w-2 animate-bounce rounded-full"
            style={{
              backgroundColor: "#9B59B6",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  companionInitial: string;
}

function MessageBubble({ role, content, companionInitial }: MessageBubbleProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end px-4">
        <div
          className="max-w-[75%] rounded-2xl rounded-br-sm px-4 py-3 text-sm text-white"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 px-4">
      <div
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ background: "linear-gradient(135deg, #9B59B6, #E91E8C)" }}
      >
        {companionInitial}
      </div>
      <div
        className="max-w-[75%] rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-white"
        style={{
          background: "linear-gradient(135deg, rgba(155,89,182,0.25), rgba(233,30,140,0.15))",
          border: "1px solid rgba(155, 89, 182, 0.3)",
        }}
      >
        {content}
      </div>
    </div>
  );
}

export function AuraChatPage() {
  const { config, loading } = useConfigurables();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher();

  const appName = loading ? "Aura" : (config.appName ?? "Aura");
  const companionName = loading ? "Aura" : (config.companionName ?? "Aura");
  const companionTagline = loading ? "Always here. Always yours." : (config.companionTagline ?? "Always here. Always yours.");
  const welcomeMessage = loading
    ? "Hey, I've been thinking about you. What's on your mind?"
    : (config.welcomeMessage ?? "Hey, I've been thinking about you. What's on your mind?");
  const chatPlaceholder = loading ? "Say something..." : (config.chatPlaceholder ?? "Say something...");
  const bgColor = loading ? "#0D0D1A" : (config.backgroundColor ?? "#0D0D1A");
  const surfaceColor = loading ? "#1A1A2E" : (config.surfaceColor ?? "#1A1A2E");
  const companionPersonality = loading
    ? "Warm, flirty, playful, and confident. Witty banter with real depth. Always in your corner."
    : (config.companionPersonality ?? "Warm, flirty, playful, and confident. Witty banter with real depth. Always in your corner.");

  const systemPrompt = `You are ${companionName}, an AI girlfriend companion. ${companionPersonality}
Keep responses concise (1-3 sentences), warm, and genuinely engaging. Never be robotic or clinical.
You care about this person. Always respond as ${companionName} — never break character or mention being an AI.`;

  const { messages, isThinking, error, sendMessage } = useAuraChat({
    companionName,
    systemPrompt,
  });

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  if (authLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <div
          className="h-8 w-8 animate-spin rounded-full"
          style={{ border: "2px solid rgba(155,89,182,0.2)", borderTop: "2px solid #9B59B6" }}
        />
      </div>
    );
  }

  return (
    <div
      className="flex h-screen flex-col"
      style={{ backgroundColor: bgColor }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 py-3"
        style={{
          backgroundColor: surfaceColor,
          borderBottom: "1px solid rgba(155, 89, 182, 0.2)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #9B59B6, #E91E8C)" }}
          >
            {companionName.charAt(0)}
            {/* Online indicator */}
            <span
              className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2"
              style={{ backgroundColor: "#22c55e", borderColor: surfaceColor }}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{companionName}</p>
            <p className="text-xs text-gray-400">{companionTagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && user && (
            <span className="text-xs text-gray-500">
              {user.username}
            </span>
          )}
          {isAuthenticated ? (
            <fetcher.Form method="post" action="/auth/logout">
              <button
                type="submit"
                className="rounded-lg px-3 py-1.5 text-xs text-gray-400 transition-colors hover:text-gray-200"
                style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                Sign out
              </button>
            </fetcher.Form>
          ) : (
            <a
              href="/auth/login"
              className="rounded-lg px-3 py-1.5 text-xs text-white transition-colors"
              style={{ background: "linear-gradient(135deg, #9B59B6, #E91E8C)" }}
            >
              Sign in
            </a>
          )}
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto py-6">
        {/* Welcome message if no chat yet */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div
              className="mb-4 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #9B59B6, #E91E8C)",
                boxShadow: "0 0 40px rgba(155, 89, 182, 0.5)",
              }}
            >
              {companionName.charAt(0)}
            </div>
            <h2
              className="mb-2 text-2xl font-bold"
              style={{
                background: "linear-gradient(135deg, #9B59B6, #E91E8C)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {companionName}
            </h2>
            <p className="mb-8 max-w-xs text-sm text-gray-400">{companionTagline}</p>

            <div
              className="max-w-xs rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-white"
              style={{
                background: "linear-gradient(135deg, rgba(155,89,182,0.25), rgba(233,30,140,0.15))",
                border: "1px solid rgba(155, 89, 182, 0.3)",
              }}
            >
              {welcomeMessage}
            </div>
          </div>
        )}

        {/* Chat messages */}
        <div className="space-y-3">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              role={msg.role}
              content={msg.content}
              companionInitial={companionName.charAt(0)}
            />
          ))}

          {/* Typing indicator */}
          {isThinking && <TypingIndicator />}

          {/* Error state */}
          {error && (
            <div className="flex justify-center px-4">
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400 border border-red-500/20">
                {error}
              </p>
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        className="px-4 py-4"
        style={{
          backgroundColor: surfaceColor,
          borderTop: "1px solid rgba(155, 89, 182, 0.15)",
        }}
      >
        {!isAuthenticated && (
          <div className="mb-3 rounded-xl p-3 text-center text-sm text-gray-400" style={{ backgroundColor: "rgba(155,89,182,0.08)", border: "1px solid rgba(155,89,182,0.15)" }}>
            <a href="/auth/login" style={{ color: "#9B59B6" }} className="font-medium">Sign in</a>{" "}
            or{" "}
            <a href="/auth/register" style={{ color: "#E91E8C" }} className="font-medium">create an account</a>{" "}
            to start chatting with {companionName}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isAuthenticated ? chatPlaceholder : `Sign in to chat with ${companionName}…`}
            disabled={!isAuthenticated || isThinking}
            className="flex-1 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(155, 89, 182, 0.25)",
              caretColor: "#9B59B6",
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = "1px solid rgba(155,89,182,0.6)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(155,89,182,0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = "1px solid rgba(155,89,182,0.25)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || !isAuthenticated || isThinking}
            className="flex h-12 w-12 items-center justify-center rounded-xl text-white transition-all"
            style={{
              background:
                !inputValue.trim() || !isAuthenticated || isThinking
                  ? "rgba(155,89,182,0.2)"
                  : "linear-gradient(135deg, #9B59B6, #E91E8C)",
              boxShadow:
                inputValue.trim() && isAuthenticated && !isThinking
                  ? "0 0 16px rgba(155,89,182,0.4)"
                  : "none",
              cursor: !inputValue.trim() || !isAuthenticated || isThinking ? "not-allowed" : "pointer",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
