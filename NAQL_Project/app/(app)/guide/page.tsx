"use client";

import { BookOpen, Clock } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { GUIDE_ARTICLES } from "@/data/guide";

export default function GuidePage() {
  const [openArticleId, setOpenArticleId] = useState<string | null>(null);
  const openArticle = GUIDE_ARTICLES.find((article) => article.id === openArticleId) ?? null;

  return (
    <div className="container flex flex-col gap-6 py-8 sm:py-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">دليل نَقْل</h1>
        <p className="mt-1 text-sm text-ink-muted">مقالات عملية مختصرة تساعدك في كل مرحلة من رحلة انتقالك.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDE_ARTICLES.map((article) => (
          <button
            key={article.id}
            type="button"
            onClick={() => setOpenArticleId(article.id)}
            className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-surface p-6 text-start shadow-card transition-colors hover:border-primary/40 hover:bg-primary-light/20"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
              <BookOpen className="size-5" strokeWidth={1.75} />
            </span>
            <h2 className="font-display text-base font-semibold text-ink">{article.title}</h2>
            <p className="text-sm leading-relaxed text-ink-muted">{article.summary}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-xs text-ink-faint">
              <Clock className="size-3.5" />
              {article.readTime}
            </span>
          </button>
        ))}
      </div>

      <Modal
        open={openArticle !== null}
        onClose={() => setOpenArticleId(null)}
        title={openArticle?.title ?? ""}
        description={openArticle?.readTime}
        size="lg"
      >
        {openArticle ? (
          <div className="flex flex-col gap-5">
            {openArticle.sections.map((section, index) => (
              <div key={index}>
                {section.heading ? (
                  <h3 className="mb-2 font-display text-sm font-semibold text-ink">{section.heading}</h3>
                ) : null}
                {section.paragraphs?.map((paragraph, pIndex) => (
                  <p key={pIndex} className="mb-2 text-sm leading-relaxed text-ink-muted last:mb-0">
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="flex flex-col gap-2">
                    {section.bullets.map((bullet, bIndex) => (
                      <li key={bIndex} className="flex items-start gap-2 text-sm leading-relaxed text-ink-muted">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
