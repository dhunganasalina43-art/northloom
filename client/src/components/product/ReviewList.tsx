"use client";

import { IReview } from "@/types";

export default function ReviewList({ reviews }: { reviews: IReview[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-ink-900/60">No reviews yet — be the first to write one.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const authorName =
          typeof review.user === "object" ? review.user.full_name : "Customer";
        return (
          <div key={review._id} className="border-b border-ink-900/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-weft-500">{"★".repeat(review.rating)}</span>
              <span className="text-ink-900/20">{"★".repeat(5 - review.rating)}</span>
              <span className="text-sm font-medium text-ink-900">{authorName}</span>
            </div>
            <p className="mt-1 text-sm text-ink-900/70">{review.comment}</p>
            <p className="mt-1 text-xs text-ink-900/40">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}