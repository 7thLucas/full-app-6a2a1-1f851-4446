import { useState, useCallback, useRef } from "react";
import { invokeLLM } from "@qb/agentic";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UseChatOptions {
  companionName: string;
  systemPrompt: string;
}

export function useAuraChat({ companionName, systemPrompt }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isThinking) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsThinking(true);
      setError(null);
      abortRef.current = false;

      try {
        // Build conversation history for context (last 10 messages)
        const history = [...messages.slice(-10), userMsg]
          .map((m) => `${m.role === "user" ? "User" : companionName}: ${m.content}`)
          .join("\n");

        const result = await invokeLLM({
          message: history,
          systemPrompt,
          schema: {
            type: "object",
            properties: {
              reply: {
                type: "string",
                description: `${companionName}'s response — warm, flirty, witty. 1-3 sentences.`,
              },
            },
            required: ["reply"],
            additionalProperties: false,
          },
        });

        if (abortRef.current) return;

        const reply =
          (result.response as { reply?: string } | null)?.reply ??
          "Hmm, I lost my train of thought... say that again?";

        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err: any) {
        if (!abortRef.current) {
          setError(err?.message ?? "Something went wrong. Try again?");
        }
      } finally {
        if (!abortRef.current) {
          setIsThinking(false);
        }
      }
    },
    [messages, isThinking, companionName, systemPrompt],
  );

  const clearMessages = useCallback(() => {
    abortRef.current = true;
    setMessages([]);
    setIsThinking(false);
    setError(null);
  }, []);

  return {
    messages,
    isThinking,
    error,
    sendMessage,
    clearMessages,
  };
}
