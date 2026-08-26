"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { createReview } from "@/services/review.service";
import { useAuth } from "@/context/auth.context";
import Button from "@/components/ui/Button";

export default function ReviewForm({
  productId,
  onSubmitted,
}: {
  productId: string;
  onSubmitted: () => void;
}) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <p className="text-sm text-ink-900/60">Log in to write a review.</p>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim().length < 5) {
      toast.error("Comment must be at least 5 characters");
      return;
    }
    setIsSubmitting(true);
    try {
      await createReview(productId, rating, comment.trim());
      toast.success("Review submitted");
      setComment("");
      setRating(5);
      onSubmitted();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <span className="mb-1 block text-sm font-medium text-ink-900">Your rating</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl leading-none ${star <= rating ? "text-weft-500" : "text-ink-900/20"}`}
              aria-label={`${star} star`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Share your thoughts on this product..."
        className="w-full rounded-sm border border-ink-900/20 bg-linen-50 px-3 py-2 text-sm focus:border-indigo-500"
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit review"}
      </Button>
    </form>
  );
}