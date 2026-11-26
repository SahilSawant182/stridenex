"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/lib/newsletters";

export default function NewsletterSubscribeForm({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setFeedback("");

    try {
      const message = await subscribeToNewsletter(email);
      setStatus("success");
      setFeedback(message);
      setEmail("");
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Unable to subscribe right now. Please try again.",
      );
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className={compact ? "space-y-2" : "mt-4 flex flex-col gap-2 sm:flex-row"}
      >
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your email address"
          aria-label="Email address"
          autoComplete="email"
          required
          disabled={status === "loading"}
          className={`h-11 min-w-0 border-slate-700 bg-slate-900/50 text-white placeholder:text-slate-400 ${compact ? "w-full" : "flex-1"}`}
        />
        <Button
          type="submit"
          variant="accent"
          disabled={status === "loading"}
          className={`h-11 shrink-0 whitespace-nowrap ${compact ? "btn-footer-cta w-full" : "px-5"}`}
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
          {!compact && status !== "loading" && (
            <ArrowRight className="ml-2 h-4 w-4" />
          )}
        </Button>
      </form>
      {feedback && (
        <p
          className={`mt-2 text-sm ${
            status === "success" ? "text-green-400" : "text-red-400"
          }`}
          role="status"
          aria-live="polite"
        >
          {feedback}
        </p>
      )}
    </div>
  );
}
