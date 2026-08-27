"use client";

import { AlertCircle, Loader2, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useJourney } from "@/context/JourneyContext";
import type { AIErrorPayload } from "@/lib/ai-errors";
import { computeDaysRemaining } from "@/lib/journey-metrics";
import { cn, generateId } from "@/lib/utils";
import type { AssistantResult } from "@/types";

const PRESET_QUESTIONS = [
  "كيف أرتب أولوياتي؟",
  "وش أجهز قبل يوم النقل؟",
  "كيف أقلل تكلفة الانتقال؟",
  "وش الأشياء اللي غالبًا تُنسى؟",
  "كيف أوزع ميزانيتي؟",
];

interface ConversationEntry {
  id: string;
  question: string;
  status: "loading" | "done" | "error";
  answer?: string;
  tips?: string[];
  errorMessage?: string;
}

export function AssistantPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { journey, hasStarted } = useJourney();
  const [entries, setEntries] = useState<ConversationEntry[]>([]);
  const [input, setInput] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [entries]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;
    const id = generateId("entry");
    setEntries((prev) => [...prev, { id, question: trimmed, status: "loading" }]);
    setInput("");

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          context: hasStarted && journey
            ? { city: journey.destinationCity, daysRemaining: computeDaysRemaining(journey) }
            : undefined,
        }),
      });

      const payload = (await res.json()) as AssistantResult | AIErrorPayload;

      if (!res.ok || "error" in payload) {
        const message = "message" in payload ? payload.message : "تعذر الحصول على إجابة الآن.";
        setEntries((prev) =>
          prev.map((entry) => (entry.id === id ? { ...entry, status: "error", errorMessage: message } : entry))
        );
        return;
      }

      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, status: "done", answer: payload.answer, tips: payload.tips } : entry
        )
      );
    } catch {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === id
            ? { ...entry, status: "error", errorMessage: "تعذر الاتصال بمستشار نَقْل. تحقق من اتصالك بالإنترنت." }
            : entry
        )
      );
    }
  }

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="assistant-panel-title"
        className="absolute inset-y-0 end-0 flex w-full max-w-md flex-col bg-surface shadow-soft animate-fade-in"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
              <Sparkles className="size-4" />
            </span>
            <div>
              <h2 id="assistant-panel-title" className="font-display text-base font-semibold text-ink">
                اسأل مستشار نَقْل
              </h2>
              <p className="text-xs text-ink-muted">إجابات سريعة وعملية عن تنظيم انتقالك</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-surface-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X className="size-4" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
          {entries.length === 0 ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-ink-muted">
                مستشار نَقْل يقدّم نصائح عامة عن تنظيم الانتقال. للمقارنة بين مزودي الخدمات، استخدم{" "}
                <span className="font-medium text-ink">مستشار نَقْل الذكي</span> من صفحة الخدمات.
              </p>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-ink-faint">أسئلة مقترحة</p>
                {PRESET_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => ask(q)}
                    className="rounded-xl border border-border bg-bg px-4 py-2.5 text-start text-sm text-ink transition-colors hover:border-primary/40 hover:bg-primary-light/60"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {entries.map((entry) => (
                <div key={entry.id} className="flex flex-col gap-2">
                  <div className="self-end rounded-2xl rounded-tl-sm bg-primary px-4 py-2.5 text-sm text-white max-w-[85%]">
                    {entry.question}
                  </div>
                  {entry.status === "loading" ? (
                    <div className="flex items-center gap-2 self-start rounded-2xl rounded-tr-sm bg-surface-muted px-4 py-2.5 text-sm text-ink-muted">
                      <Loader2 className="size-3.5 animate-spin" /> مستشار نَقْل يفكر…
                    </div>
                  ) : entry.status === "error" ? (
                    <div className="flex max-w-[90%] flex-col gap-2 self-start rounded-2xl rounded-tr-sm bg-danger-light px-4 py-2.5 text-sm text-danger">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="size-3.5 shrink-0" />
                        <span>{entry.errorMessage}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => ask(entry.question)}
                        className="self-start text-xs font-medium underline underline-offset-2"
                      >
                        إعادة المحاولة
                      </button>
                    </div>
                  ) : (
                    <div className="max-w-[90%] self-start rounded-2xl rounded-tr-sm bg-surface-muted px-4 py-2.5 text-sm leading-relaxed text-ink">
                      <p>{entry.answer}</p>
                      {entry.tips && entry.tips.length > 0 ? (
                        <ul className="mt-2 flex flex-col gap-1 border-t border-border pt-2">
                          {entry.tips.map((tip, index) => (
                            <li key={index} className="flex gap-1.5 text-ink-muted">
                              <span className="text-primary">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            ask(input);
          }}
          className="flex items-center gap-2 border-t border-border px-4 py-3"
        >
          <label htmlFor="assistant-input" className="sr-only">
            اكتب سؤالك
          </label>
          <input
            ref={inputRef}
            id="assistant-input"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="اكتب سؤالك هنا…"
            className="h-11 flex-1 rounded-xl border border-border bg-bg px-3.5 text-sm text-ink placeholder:text-ink-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="إرسال السؤال"
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-colors hover:bg-primary-dark disabled:opacity-40"
            )}
          >
            <Send className="size-4 -scale-x-100" />
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
