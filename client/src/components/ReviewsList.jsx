import React, { useEffect, useState } from "react";
import api from "../services/api";
import StarRating from "./StarRating";

export default function ReviewsList({ destinationId, initialReviews = [] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });

  useEffect(() => {
    if (!destinationId) return;

    setLoading(true);
    api
      .get(`/api/destinations/${destinationId}/reviews`)
      .then((res) => setReviews(res.data.reviews || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [destinationId]);

  const submitReview = (e) => {
    e.preventDefault();

    const newReview = {
      user: { name: form.name || "Anonymous" },
      rating: form.rating,
      comment: form.comment,
    };

    api
      .post(`/api/destinations/${destinationId}/reviews`, newReview)
      .then((res) => setReviews((prev) => [res.data.review, ...prev]))
      .catch((err) => console.error("Review post failed:", err));

    setForm({ name: "", rating: 5, comment: "" });
  };

  return (
    <div>
      <form onSubmit={submitReview} className="mb-4 space-y-2">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Your name"
          className="border rounded px-3 py-2 w-full"
        />

        <div className="flex gap-2 items-center">
          <label className="text-sm">Rating:</label>
          <select
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: +e.target.value })}
            className="border rounded px-2 py-1"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <textarea
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          placeholder="Write a quick review"
          className="border rounded px-3 py-2 w-full"
          rows={3}
        />

        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Submit review
        </button>
      </form>

      {loading ? (
        <div>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-sm text-gray-500">No reviews yet — be the first!</div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                    {r.user?.name?.[0] ?? "U"}
                  </div>
                  <div>
                    <div className="font-semibold">{r.user?.name ?? "User"}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <StarRating value={r.rating} size={14} />
              </div>
              <p className="mt-2 text-gray-700">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
